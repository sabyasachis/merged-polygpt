<div align="center">
  <img src="assets/icons/original_white.png" alt="PolyGPT Logo" width="400">
</div>

# PolyGPT

Interact with multiple AI assistants simultaneously in a split-screen interface. 
Type once and send your prompts to ChatGPT, Claude, Gemini, and Perplexity at the same time.

## Demo

![PolyGPT Demo](https://storage.googleapis.com/polygpt-assets/demo.gif)

## Privacy

- 100% Private, no data is collected
- Your login credentials stay between you and your AI provider

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

### macOS Installation Instructions

**Important:** This app is not signed with an Apple Developer certificate. macOS will show a security warning. Here's how to install safely:

#### Method 1: Remove Quarantine Attribute (Easiest)
1. Download `polygpt.dmg`
2. Open Terminal and run:
   ```bash
   xattr -cr /Applications/PolyGPT.app
   ```
3. Double-click PolyGPT.app to launch

#### Method 2: System Settings
1. Download `polygpt.dmg`
2. Try to open PolyGPT.app (you'll get a warning)
3. Open **System Settings → Privacy & Security**
4. Scroll down to find "PolyGPT was blocked..."
5. Click **Open Anyway**
6. Confirm by clicking **Open**

#### Method 3: Right-Click Method
1. Download `polygpt.dmg`
2. **Right-click** (or Control+click) on PolyGPT.app
3. Select **Open** from the menu
4. Click **Open** in the dialog

**Why this happens:** The app is open source and unsigned to keep it free. Apple requires a $99/year developer certificate to avoid these warnings. You can verify the source code is safe by checking the [GitHub repository](https://github.com/ncvgl/polygpt).

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.
