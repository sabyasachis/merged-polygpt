const { ipcRenderer } = require('electron');
const {
  loadConfig,
  findElement,
  createSubmitHandler,
  setupIPCListeners,
  setupInputScanner,
  createUIControls,
  setupViewInfoListener,
  setupSupersizeListener,
  setupLoadingOverlay,
  waitForDOM,
  setupResponseMonitoring,
  setupHealthCheck,
} = require('./shared-preload-utils');

const config = loadConfig();
const provider = 'claude';

let inputElement = null;
let lastText = '';
function injectText(text) {
  // Always rescan input element in case user switched chats
  inputElement = findElement(config.claude?.input);

  if (!inputElement) {
    ipcRenderer.invoke('selector-error', 'claude', 'Input element not found');
    return;
  }

  lastText = text;

  // Handle textarea
  if (inputElement.tagName === 'TEXTAREA') {
    inputElement.value = text;
    // Set selection to end of text
    inputElement.selectionStart = text.length;
    inputElement.selectionEnd = text.length;
  } else if (inputElement.contentEditable === 'true') {
    // Handle contenteditable div - preserve newlines as <br>
    // Clear existing content - avoid innerHTML due to TrustedHTML CSP
    while (inputElement.firstChild) {
      inputElement.removeChild(inputElement.firstChild);
    }

    // Split by newlines and create text nodes with <br> between them
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      inputElement.appendChild(document.createTextNode(line));
      if (index < lines.length - 1) {
        inputElement.appendChild(document.createElement('br'));
      }
    });
  } else if (inputElement.tagName === 'INPUT') {
    inputElement.value = text;
  }

  // Dispatch events to trigger React/framework detection
  const events = [
    new Event('input', { bubbles: true }),
    new Event('change', { bubbles: true }),
    new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: 'a',
    }),
  ];

  events.forEach((event) => inputElement.dispatchEvent(event));
}

const submitMessage = createSubmitHandler(
  provider,
  config,
  () => inputElement,
  null
);

setupIPCListeners(provider, config, injectText, submitMessage, { value: lastText });

setupInputScanner(
  provider,
  config,
  () => inputElement,
  (el) => { inputElement = el; },
  null
);

const getMergerWindow = async () => {
  const settings = await ipcRenderer.invoke('get-merge-settings');
  return settings?.mergerWindow || 'bottomRight';
};

const getViewInfo = setupViewInfoListener((viewInfo) => {
  window.polygptGetViewInfo = () => viewInfo;
  createUIControls(viewInfo);
}, getMergerWindow);

setupSupersizeListener();

setupLoadingOverlay();

// Debug function to inspect actual DOM structure
window.polygptDebugClaudeDOM = function() {
  console.log('=== Claude DOM Debug Info ===');
  const container = findElement(config.claude?.responseContainer);
  console.log('Response container:', container);

  if (container) {
    // Find all potential response elements
    console.log('\n--- All divs with message-author attributes ---');
    const messageElements = container.querySelectorAll('[data-message-author-role]');
    console.log(`Found ${messageElements.length} elements with data-message-author-role`);
    messageElements.forEach((el, idx) => {
      console.log(`Element ${idx + 1}:`, {
        tag: el.tagName,
        role: el.getAttribute('data-message-author-role'),
        classes: el.className,
        attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`),
        textPreview: (el.innerText || '').substring(0, 100)
      });
    });

    console.log('\n--- All elements with "assistant" in class ---');
    const assistantElements = container.querySelectorAll('[class*="assistant"]');
    console.log(`Found ${assistantElements.length} elements with "assistant" in class`);
    assistantElements.forEach((el, idx) => {
      console.log(`Element ${idx + 1}:`, {
        tag: el.tagName,
        classes: el.className,
        attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`),
        textPreview: (el.innerText || '').substring(0, 100)
      });
    });

    console.log('\n--- All elements with prose/markdown classes ---');
    const proseElements = container.querySelectorAll('[class*="prose"], [class*="markdown"]');
    console.log(`Found ${proseElements.length} elements with prose/markdown classes`);
    proseElements.forEach((el, idx) => {
      const info = {
        tag: el.tagName,
        classes: el.className,
        parent: el.parentElement?.className,
        textLength: (el.innerText || '').length,
        textPreview: (el.innerText || '').substring(0, 100)
      };
      console.log(`Prose Element ${idx + 1}:`, JSON.stringify(info, null, 2));
    });

    // NEW: Try to find ANY element that contains substantial text
    console.log('\n--- All elements with substantial text (>100 chars) ---');
    const allElements = container.querySelectorAll('*');
    const textElements = Array.from(allElements).filter(el => {
      const text = el.innerText || el.textContent || '';
      // Filter out CSS/script content
      if (text.includes('{') && text.includes('}')) {
        const cssChars = (text.match(/[{}:;]/g) || []).length;
        if (cssChars > text.length * 0.1) return false;
      }
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;

      return text.length > 100 && !el.querySelector('input, textarea') && text.trim().length > 50;
    });
    console.log(`Found ${textElements.length} elements with substantial text`);

    // Sort by text length to show likely responses first
    textElements.sort((a, b) => {
      const aLen = (a.innerText || '').length;
      const bLen = (b.innerText || '').length;
      return bLen - aLen;
    });

    textElements.slice(0, 10).forEach((el, idx) => {
      const info = {
        tag: el.tagName,
        classes: el.className,
        id: el.id,
        attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`),
        textLength: (el.innerText || '').length,
        textPreview: (el.innerText || '').substring(0, 150),
        // Add parent info to help construct selector
        parentTag: el.parentElement?.tagName,
        parentClasses: el.parentElement?.className,
      };
      console.log(`Text Element ${idx + 1}:`, JSON.stringify(info, null, 2));
    });
  }
  console.log('=== End Debug Info ===');
};

// Auto-run debug after a delay to capture initial state
setTimeout(() => {
  console.log('[AUTO-DEBUG] Running automatic DOM inspection in 5 seconds...');
  setTimeout(() => {
    window.polygptDebugClaudeDOM();
  }, 5000);
}, 1000);

// Setup response monitoring
const responseMonitor = setupResponseMonitoring(provider, config, ipcRenderer, getViewInfo);
waitForDOM(() => {
  const viewInfo = getViewInfo();
  if (viewInfo) createUIControls(viewInfo);
  // Start monitoring after a short delay to ensure page is loaded
  setTimeout(() => responseMonitor.startMonitoring(), 2000);
});

// Setup health check (runs 10 seconds after page load)
setupHealthCheck(provider, config, getViewInfo);
