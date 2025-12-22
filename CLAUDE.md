# PolyGPT - Multi-AI Assistant Desktop Application

## Project Overview

PolyGPT is a cross-platform Electron desktop application that enables users to interact with multiple AI assistants simultaneously. It displays four AI providers (ChatGPT, Claude, Gemini, and Perplexity) in a 2x2 grid layout, allowing users to send the same prompt to all providers at once using a single unified text input.

**Key Value Proposition:** Type once, send to all AI providers simultaneously, eliminating repetitive typing across different platforms.

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
│   ├── index.js           # Main process entry point, IPC handlers
│   └── window-manager.js  # Window layout, provider management, view orchestration
├── preload/
│   ├── shared-preload-utils.js    # Shared utilities for all providers
│   ├── chatgpt-preload.js         # ChatGPT-specific DOM manipulation
│   ├── claude-preload.js          # Claude-specific DOM manipulation
│   ├── gemini-preload.js          # Gemini-specific DOM manipulation
│   └── perplexity-preload.js      # Perplexity-specific DOM manipulation
├── renderer/
│   ├── index.html         # Control bar UI
│   ├── renderer.js        # Control bar logic
│   └── styles.css         # Control bar styling
└── utils/
    └── throttle.js        # Text update throttling
config/
├── selectors.json         # CSS selectors for each provider's DOM elements
└── window-providers.json  # User's provider configuration (persisted)
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

### Text Injection Strategies
- **Textarea/Input:** Direct `.value` assignment
- **ContentEditable:** DOM manipulation with text nodes
- **Perplexity:** Advanced `execCommand` for incremental text operations
- **Gemini:** Special handling for `RICH-TEXTAREA` custom element

### Provider-Specific Details
- **ChatGPT:** Handles both textarea and contentEditable inputs
- **Claude:** Uses ProseMirror editor detection
- **Gemini:** Nested contenteditable divs with custom elements
- **Perplexity:** Lexical editor with format-preserving text injection

### Security
- Context isolation enabled
- NodeIntegration disabled for provider views
- Persistent partition storage for login sessions
- Hardened runtime on macOS

## Development

**Current Version:** 0.2.5

**Commands:**
- `npm start` - Run in normal mode
- `npm run dev` - Run with DevTools
- `npm run build` - Build for all platforms

**Recent Focus:**
- macOS notarization and code signing
- Context menu improvements
- Multi-line copy functionality

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
