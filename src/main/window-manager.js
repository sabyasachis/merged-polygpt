const { BaseWindow, WebContentsView, ipcMain } = require('electron');
const path = require('path');

async function createWindow() {
  // Create main window
  const mainWindow = new BaseWindow({
    width: 1600,
    height: 900,
    show: false,
    backgroundColor: '#e0e0e0', // Light gray for separators
    icon: path.join(__dirname, '../../assets/icons/icon.icns'),
  });

  // Maximize the window
  mainWindow.maximize();

  // Track which view is supersized (null = normal grid)
  let supersizedView = null;

  // Create main renderer content view (control bar)
  const mainView = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Create ChatGPT view (top-left)
  const chatgptView = new WebContentsView({
    webPreferences: {
      partition: 'persist:shared',
      preload: path.join(__dirname, '../preload/chatgpt-preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Create Gemini view (top-right)
  const geminiView = new WebContentsView({
    webPreferences: {
      partition: 'persist:shared',
      preload: path.join(__dirname, '../preload/gemini-preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Create Perplexity view (top-right)
  const perplexityView = new WebContentsView({
    webPreferences: {
      partition: 'persist:shared',
      preload: path.join(__dirname, '../preload/perplexity-preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Set User-Agent to avoid browser detection issues
  perplexityView.webContents.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  );

  // Create Claude view (bottom-right)
  const claudeView = new WebContentsView({
    webPreferences: {
      partition: 'persist:shared',
      preload: path.join(__dirname, '../preload/claude-preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Create overlay views for supersize buttons
  const claudeOverlay = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      transparent: true,
    },
  });

  const perplexityOverlay = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      transparent: true,
    },
  });

  const chatgptOverlay = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      transparent: true,
    },
  });

  const geminiOverlay = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      transparent: true,
    },
  });

  // Add views to window (overlays on top)
  mainWindow.contentView.addChildView(chatgptView);
  mainWindow.contentView.addChildView(geminiView);
  mainWindow.contentView.addChildView(perplexityView);
  mainWindow.contentView.addChildView(claudeView);
  mainWindow.contentView.addChildView(chatgptOverlay);
  mainWindow.contentView.addChildView(geminiOverlay);
  mainWindow.contentView.addChildView(perplexityOverlay);
  mainWindow.contentView.addChildView(claudeOverlay);
  mainWindow.contentView.addChildView(mainView);

  // Set bounds for views (updated on resize)
  function updateBounds() {
    const bounds = mainWindow.getContentBounds();
    const width = bounds.width;
    const height = bounds.height;
    const controlBarHeight = 100; // Height reserved for control bar
    const chatAreaHeight = height - controlBarHeight;

    if (supersizedView === null) {
      // Normal 2x2 grid mode
      const halfWidth = Math.floor(width / 2);
      const halfHeight = Math.floor(chatAreaHeight / 2);
      const gap = 1; // 1px gap for separators

      // Top-left: Claude
      const claudeBounds = {
        x: 0,
        y: 0,
        width: halfWidth - Math.floor(gap / 2),
        height: halfHeight - Math.floor(gap / 2),
      };
      claudeView.setBounds(claudeBounds);
      claudeOverlay.setBounds(claudeBounds);

      // Top-right: Perplexity
      const perplexityBounds = {
        x: halfWidth + Math.ceil(gap / 2),
        y: 0,
        width: width - halfWidth - Math.ceil(gap / 2),
        height: halfHeight - Math.floor(gap / 2),
      };
      perplexityView.setBounds(perplexityBounds);
      perplexityOverlay.setBounds(perplexityBounds);

      // Bottom-left: ChatGPT
      const chatgptBounds = {
        x: 0,
        y: halfHeight + Math.ceil(gap / 2),
        width: halfWidth - Math.floor(gap / 2),
        height: chatAreaHeight - halfHeight - Math.ceil(gap / 2),
      };
      chatgptView.setBounds(chatgptBounds);
      chatgptOverlay.setBounds(chatgptBounds);

      // Bottom-right: Gemini
      const geminiBounds = {
        x: halfWidth + Math.ceil(gap / 2),
        y: halfHeight + Math.ceil(gap / 2),
        width: width - halfWidth - Math.ceil(gap / 2),
        height: chatAreaHeight - halfHeight - Math.ceil(gap / 2),
      };
      geminiView.setBounds(geminiBounds);
      geminiOverlay.setBounds(geminiBounds);
    } else {
      // Supersized mode: one view takes 80%, others are thumbnails
      const mainWidth = Math.floor(width * 0.8);
      const thumbnailWidth = width - mainWidth - 2; // 2px gap
      const thumbnailHeight = Math.floor(chatAreaHeight / 3);
      const gap = 1;

      const views = {
        claude: { view: claudeView, overlay: claudeOverlay },
        perplexity: { view: perplexityView, overlay: perplexityOverlay },
        chatgpt: { view: chatgptView, overlay: chatgptOverlay },
        gemini: { view: geminiView, overlay: geminiOverlay },
      };

      // Position supersized view
      const supersized = views[supersizedView];
      const supersizedBounds = {
        x: 0,
        y: 0,
        width: mainWidth,
        height: chatAreaHeight,
      };
      supersized.view.setBounds(supersizedBounds);
      supersized.overlay.setBounds(supersizedBounds);

      // Position thumbnails vertically on the right
      const thumbnails = Object.entries(views).filter(([id]) => id !== supersizedView);
      thumbnails.forEach(([id, { view, overlay }], index) => {
        const thumbnailBounds = {
          x: mainWidth + 2,
          y: index * (thumbnailHeight + gap),
          width: thumbnailWidth,
          height: thumbnailHeight - (index < thumbnails.length - 1 ? gap : 0),
        };
        view.setBounds(thumbnailBounds);
        overlay.setBounds(thumbnailBounds);
      });
    }

    // Bottom control bar - full width
    mainView.setBounds({
      x: 0,
      y: chatAreaHeight,
      width: width,
      height: controlBarHeight,
    });
  }

  // Toggle supersize for a view
  function toggleSupersize(viewId) {
    if (supersizedView === viewId) {
      supersizedView = null;
    } else {
      supersizedView = viewId;
    }
    updateBounds();

    // Notify all overlays of state change
    claudeOverlay.webContents.send('supersize-state-changed', supersizedView);
    perplexityOverlay.webContents.send('supersize-state-changed', supersizedView);
    chatgptOverlay.webContents.send('supersize-state-changed', supersizedView);
    geminiOverlay.webContents.send('supersize-state-changed', supersizedView);

    return supersizedView;
  }

  // Update bounds on window resize
  mainWindow.on('resized', updateBounds);

  // Load content
  mainView.webContents.loadFile(path.join(__dirname, '../renderer/index.html'));
  chatgptView.webContents.loadURL('https://chat.openai.com');
  geminiView.webContents.loadURL('https://gemini.google.com');
  perplexityView.webContents.loadURL('https://www.perplexity.ai');
  claudeView.webContents.loadURL('https://claude.ai');

  // Load overlay controls with view IDs
  claudeOverlay.webContents.loadFile(
    path.join(__dirname, '../renderer/overlay.html'),
    { query: { view: 'claude' } }
  );
  perplexityOverlay.webContents.loadFile(
    path.join(__dirname, '../renderer/overlay.html'),
    { query: { view: 'perplexity' } }
  );
  chatgptOverlay.webContents.loadFile(
    path.join(__dirname, '../renderer/overlay.html'),
    { query: { view: 'chatgpt' } }
  );
  geminiOverlay.webContents.loadFile(
    path.join(__dirname, '../renderer/overlay.html'),
    { query: { view: 'gemini' } }
  );

  // Forward console messages from all views to terminal
  chatgptView.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[ChatGPT] ${message}`);
  });
  geminiView.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Gemini] ${message}`);
  });
  perplexityView.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Perplexity] ${message}`);
  });
  claudeView.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Claude] ${message}`);
  });
  mainView.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[ControlBar] ${message}`);
  });
  claudeOverlay.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[ClaudeOverlay] ${message}`);
  });
  perplexityOverlay.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[PerplexityOverlay] ${message}`);
  });
  chatgptOverlay.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[ChatGPTOverlay] ${message}`);
  });
  geminiOverlay.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[GeminiOverlay] ${message}`);
  });

  // Open dev tools in development
  if (process.argv.includes('--dev')) {
    chatgptView.webContents.openDevTools({ mode: 'detach' });
    geminiView.webContents.openDevTools({ mode: 'detach' });
    perplexityView.webContents.openDevTools({ mode: 'detach' });
    claudeView.webContents.openDevTools({ mode: 'detach' });
    mainView.webContents.openDevTools({ mode: 'detach' });
  }

  // Initial bounds calculation
  setTimeout(updateBounds, 100);

  mainWindow.show();

  // Store references for access in main process
  mainWindow.mainView = mainView;
  mainWindow.chatgptView = chatgptView;
  mainWindow.geminiView = geminiView;
  mainWindow.perplexityView = perplexityView;
  mainWindow.claudeView = claudeView;
  mainWindow.chatgptOverlay = chatgptOverlay;
  mainWindow.geminiOverlay = geminiOverlay;
  mainWindow.perplexityOverlay = perplexityOverlay;
  mainWindow.claudeOverlay = claudeOverlay;
  mainWindow.toggleSupersize = toggleSupersize;
  mainWindow.getSupersizedView = () => supersizedView;

  return mainWindow;
}

module.exports = { createWindow };
