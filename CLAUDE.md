# PolyGPT - Multi-AI Assistant Desktop Application

## Project Overview

PolyGPT is a cross-platform Electron desktop application that enables users to interact with multiple AI assistants simultaneously. It displays four AI providers (ChatGPT, Claude, Gemini, and Perplexity) in a 2x2 grid layout, allowing users to send the same prompt to all providers at once using a single unified text input.

**Key Value Proposition:** Type once, send to all AI providers simultaneously, eliminating repetitive typing across different platforms.

**NEW: Merge Mode** - Get AI-synthesized answers from multiple LLMs with citations, reducing cognitive load when comparing responses. Inspired by Andrej Karpathy's "LLM council" concept.

## Technology Stack

- **Electron 31.0.0** - Cross-platform desktop framework
- **Node.js/JavaScript** - Backend logic
- **HTML5/CSS3** - UI rendering
- **electron-builder 24.9.1** - Build and distribution
- **IPC** - Inter-process communication between main and renderer processes

**Supported Platforms:** macOS (universal), Windows (x64), Linux (AppImage, .deb)

## Architecture

### Directory Structure

```
src/
├── main/
│   ├── index.js           # Main process entry point, IPC handlers, merge mode logic
│   └── window-manager.js  # Window layout, provider management, view orchestration
├── preload/
│   ├── shared-preload-utils.js    # Shared utilities, response detection, merge mode UI
│   ├── chatgpt-preload.js         # ChatGPT-specific DOM manipulation
│   ├── claude-preload.js          # Claude-specific DOM manipulation
│   ├── gemini-preload.js          # Gemini-specific DOM manipulation
│   └── perplexity-preload.js      # Perplexity-specific DOM manipulation
├── renderer/
│   ├── index.html         # Control bar UI with merge button
│   ├── renderer.js        # Control bar logic, merge mode controls
│   └── styles.css         # Control bar styling, merge mode UI
└── utils/
    └── throttle.js        # Text update throttling
config/
├── selectors.json         # CSS selectors for providers and response detection
└── window-providers.json  # User's provider configuration (persisted)
docs/
└── demo.mp4               # Demo video for README
USAGE.md                   # Detailed usage instructions for merge mode
CLAUDE.md                  # AI context documentation for session continuity
```

### Key Components

1. **Main Process** (`src/main/index.js`)
   - IPC handlers for text updates, message submission, new chat, zoom, supersize mode, provider switching

2. **Window Manager** (`src/main/window-manager.js`)
   - Creates 5 WebContentsViews: 4 providers + 1 control bar
   - Manages layouts: normal (2x2 grid) and supersize mode (80% main + 20% thumbnails)
   - Persists provider configuration to `config/window-providers.json`

3. **Control Bar** (`src/renderer/`)
   - Unified text input with character counter
   - Action buttons: New Chat, Refresh, Zoom controls
   - Keyboard shortcuts: Enter to submit, Shift+Enter for new line

4. **Preload Scripts** (Provider-specific)
   - DOM element discovery using CSS selectors from `config/selectors.json`
   - Text injection into provider input fields
   - Submit/new-chat button clicking
   - Provider dropdown and supersize button UI creation

5. **Shared Utilities** (`shared-preload-utils.js`)
   - Configuration loading from `selectors.json`
   - DOM utilities (`findElement()`)
   - IPC listener setup
   - Loading overlay management
   - Input element scanner

## Features

### Merge Mode (NEW)
- **AI-Synthesized Responses** - Ask once, get one coherent answer combining insights from multiple LLMs
- **Automatic Citations** - Each point is cited [1] [2] [3] to show which model contributed
- **Reduced Cognitive Load** - No more mentally synthesizing three different answers
- **Follow-up Context** - Continue merged conversations with maintained context
- **Configurable Timeout** - Auto-merge after responses arrive (adjustable settings)
- **Visual Indicators** - Merger window shows which providers contributed to the answer

### Core Features
- **4-way Split View** - 2x2 grid with all 4 providers visible
- **Unified Input** - Single textarea syncs to all providers simultaneously
- **Provider Switching** - Dropdown to swap any provider on-the-fly
- **Supersize Mode** - Expand one provider to 80% width, collapse others to thumbnails
- **Zoom Controls** - Adjust text size (50%-200%)
- **New Chat** - Start fresh conversation across all providers
- **Refresh** - Reload all provider pages
- **Session Persistence** - Stay logged in across app restarts
- **Context Menus** - Right-click copy/paste support
- **No API Keys Required** - Uses official web interfaces directly

## Technical Implementation Notes

### Merge Mode Implementation
- **Response Detection:** CSS selectors in `config/selectors.json` identify response containers for each provider
- **Content Extraction:** MutationObserver monitors DOM for new responses in each provider window
- **Response Collection:** Waits for 3 providers to complete responses (configurable timeout)
- **AI Synthesis:** Uses one provider (typically Claude) to merge responses with citations
- **Citation Mapping:** [1] [2] [3] links back to source providers
- **Context Preservation:** Follow-up questions include previous merged conversation history
- **Visual Indicators:** Merger window displays which providers contributed to synthesis

### Text Injection Strategies
- **Textarea/Input:** Direct `.value` assignment
- **ContentEditable:** DOM manipulation with text nodes
- **Perplexity:** Advanced `execCommand` for incremental text operations
- **Gemini:** Special handling for `RICH-TEXTAREA` custom element

### Provider-Specific Details
- **ChatGPT:** Handles both textarea and contentEditable inputs
- **Claude:** Uses ProseMirror editor detection, also serves as merge synthesizer
- **Gemini:** Nested contenteditable divs with custom elements
- **Perplexity:** Lexical editor with format-preserving text injection

### Security
- Context isolation enabled
- NodeIntegration disabled for provider views
- Persistent partition storage for login sessions
- Hardened runtime on macOS (disabled for unsigned distribution)

## Development

**Current Version:** 0.2.5

**Repository:** https://github.com/sabyasachis/merged-polygpt

### Development Commands

**Running from Source (Recommended):**
```bash
export PATH="/tmp/node-v20.11.0-darwin-arm64/bin:$PATH"
npm install
npm start
```

**Other Commands:**
- `npm run dev` - Run with DevTools
- `npm run build` - Build DMG for macOS (output in `dist/`)

### Release Process

**Build and Create Release:**
```bash
# Build the DMG
export PATH="/tmp/node-v20.11.0-darwin-arm64/bin:$PATH"
npm run build

# Create GitHub release
/opt/homebrew/bin/gh release create v0.2.X dist/PolyGPT-0.2.X-universal.dmg \
  --title "v0.2.X - [Feature Name]" \
  --notes "[Release notes]"
```

**Latest Release:** [v0.2.6](https://github.com/sabyasachis/merged-polygpt/releases/tag/v0.2.6)
- Pre-built macOS DMG available (172MB universal binary)
- Installation: Drag to Applications, then run `xattr -cr /Applications/PolyGPT.app`

### Recent Development Activity

**Recent Commits:**
1. **Fix response detection with robust selector system** (v0.2.6)
   - Removed broken `:last-of-type` pseudo-selectors
   - Implemented auto-discovery fallback for when selectors fail
   - Added `progressive-markdown` and `standard-markdown` selectors for Claude
   - Enhanced Gemini with multiple fallback selectors
   - Fixed auto-merge not triggering issue
2. **Add documentation file for Claude AI context** - Created claude.md for session continuity
3. **Add merge mode feature** (1,483 insertions across 12 files)
   - AI-synthesized responses from multiple providers
   - Automatic citations [1] [2] [3]
   - Configurable auto-merge timeout
   - Visual merger window indicators
4. **Rebrand README to merged-polygpt** - Simplified structure, added demo GIF

**Recent Focus:**
- Response detection reliability and auto-merge fixes
- Adaptive selector system for future-proofing
- Command-line release workflow with GitHub CLI
- Documentation and debugging tools

## Troubleshooting & Debugging

### Common Issues

#### Auto-Merge Not Triggering

**Symptoms:** Providers complete responses but merge doesn't trigger (stuck at 2/3 or doesn't reach 3/3)

**Root Cause:** Response detection failing due to outdated CSS selectors

**Debug Steps:**
1. Open DevTools in the app (`npm run dev`)
2. Check console for `[provider] No response elements found` errors
3. Run debug functions in console:
   - `window.polygptDebugClaudeDOM()` - Inspect Claude's DOM structure
   - `window.polygptDebugGeminiDOM()` - Inspect Gemini's DOM structure
   - `window.polygptDebugStopButton()` - Check stop button detection

**Fix:** Update `config/selectors.json` with new selectors based on debug output

**Example Fix (v0.2.6):**
- **Problem:** `:last-of-type` pseudo-selector doesn't work with `querySelectorAll`
  - `div.font-claude-response:last-of-type` fails because it selects last `<div>` tag, not last element with that class
- **Solution:** Remove `:last-of-type` and let code pick last element from array
  - Use `div.font-claude-response` instead
  - Code already does `allResponses[allResponses.length - 1]`

### Auto-Discovery Fallback

When configured selectors fail, the system automatically:
1. Searches for elements with substantial text (>50 chars)
2. Excludes input fields and user messages
3. Sorts by text length (longer = likely response)
4. Takes top candidates

**Console Output:**
```
[claude] Auto-discovered 1 response elements
[gemini] Auto-discovered 10 response elements
[chatgpt] Auto-discovered 2 response elements
```

### Debug Functions Available

**In DevTools Console:**
```javascript
// Claude DOM inspection
window.polygptDebugClaudeDOM()

// Gemini DOM inspection
window.polygptDebugGeminiDOM()

// Stop button detection
window.polygptDebugStopButton()

// Get current view info
window.polygptGetViewInfo()
```

### Monitoring Response Detection

**Watch for these log patterns:**

✅ **Working:**
```
[Claude@topRight] [claude] Auto-discovered 1 response elements
[Claude@topRight] Response update: 150 chars
[Claude@topRight] ✓ Stop button disappeared, response complete
[Merge] Response complete from topRight (claude) - 3/3
[Merge] Auto-merge enabled, performing merge
```

❌ **Broken:**
```
[Claude@topRight] [claude] No response elements found. Tried selectors: ...
[Merge] Response complete from topLeft (gemini) - 1/3
[Merge] Response complete from bottomLeft (chatgpt) - 2/3
# Stuck at 2/3, never reaches 3/3
```

## Adding New Providers

1. Create preload script in `src/preload/PROVIDER-preload.js`
2. Add provider metadata to `src/main/window-manager.js`
3. Define CSS selectors in `config/selectors.json`
4. Test text injection, submission, and supersize functionality

## Target Users

- AI researchers comparing model responses
- Content creators seeking diverse perspectives
- Developers testing AI APIs in parallel
- Students learning from multiple AI explanations
- Power users avoiding context switching

## Privacy

100% private - no data collection. All interactions go directly between user and AI providers.
