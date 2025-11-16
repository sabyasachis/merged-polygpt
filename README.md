# PolyGPT

Interact with multiple AI assistants simultaneously in a split-screen interface. Type once and send your prompts to ChatGPT, Claude, Gemini, and Perplexity at the same time.

## Features

- **4-way split view** - ChatGPT, Claude, Gemini, and Perplexity in a 2x2 grid
- **Unified input** - Type once, send to all providers simultaneously
- **Provider switching** - Change any quadrant to a different provider on the fly
- **Supersize mode** - Expand any quadrant to 80% width for focused work
- **Session persistence** - Stay logged in across app restarts
- **No API keys needed** - Uses official web interfaces directly
- **Zoom controls** - Adjust text size across all views
- **Cross-platform** - macOS, Windows, and Linux

## Download

Pre-built binaries are available for all platforms:

- **macOS:** [polygpt.dmg](https://github.com/ncvgl/polygpt/releases/latest/download/polygpt.dmg)
- **Windows:** [polygpt.exe](https://github.com/ncvgl/polygpt/releases/latest/download/polygpt.exe)
- **Linux (AppImage):** [polygpt.AppImage](https://github.com/ncvgl/polygpt/releases/latest/download/polygpt.AppImage)
- **Linux (Debian):** [polygpt.deb](https://github.com/ncvgl/polygpt/releases/latest/download/polygpt.deb)

### macOS Installation Note

macOS users may see a security warning on first launch. Right-click the app and select "Open" to bypass Gatekeeper.

## Demo

![PolyGPT Demo](https://storage.googleapis.com/polygpt-assets/demo.gif)

## Building from Source

### Requirements

- Node.js 20+ and npm
- macOS, Windows, or Linux

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ncvgl/polygpt.git
   cd polygpt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm start
   ```

4. Run with DevTools (for debugging):
   ```bash
   npm run dev
   ```

### Building Distributables

Build for your current platform:

```bash
npm run build
```

Build for specific platforms:

```bash
# macOS (universal binary)
npm run build -- --mac

# Windows
npm run build -- --win

# Linux
npm run build -- --linux
```

Built files will be in the `dist/` directory.

## How It Works

- **No APIs** - Interacts directly with web interfaces via DOM injection
- **No backend** - All processing happens locally in Electron
- **Session sharing** - Uses a shared Electron session for persistent logins
- **Text mirroring** - Injects text into each provider's input field simultaneously

## Privacy

- No data is collected or transmitted to any third party
- Your login credentials stay between you and each AI provider
- All text synchronization happens locally on your machine
- The app only communicates with the official AI provider websites

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.

## Author

Nathan Cavaglione ([nathan@polygpt.app](mailto:nathan@polygpt.app))
