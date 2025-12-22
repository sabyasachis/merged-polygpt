<div align="center">
  <img src="assets/icons/original_white.png" alt="PolyGPT Logo" width="400">
</div>

# PolyGPT

Interact with multiple AI assistants simultaneously in a split-screen interface.
Type once and send your prompts to ChatGPT, Claude, Gemini, and Perplexity at the same time.

**NEW: Merge Mode** - Get AI-synthesized answers from multiple LLMs with citations, reducing cognitive load when comparing responses.

## Demo

![PolyGPT Demo](docs/demo.mp4)

## Privacy

- 100% Private, no data is collected
- Your login credentials stay between you and your AI provider

## Features

### Merge Mode (NEW)
- **AI-Synthesized Responses** - Ask once, get one coherent answer combining insights from multiple LLMs
- **Automatic Citations** - Each point is cited [1] [2] [3] to show which model contributed
- **Reduced Cognitive Load** - No more mentally synthesizing three different answers
- **Follow-up Context** - Continue merged conversations with maintained context
- **Configurable Timeout** - Auto-merge after responses arrive (adjustable settings)

Inspired by Andrej Karpathy's "LLM council" concept.

### Core Features
- **4-way split view** - ChatGPT, Claude, Gemini, and Perplexity in a 2x2 grid
- **Unified input** - Type once, send to all providers simultaneously
- **Provider switching** - Change any quadrant to a different provider on the fly
- **Supersize mode** - Expand any quadrant to 80% width for focused work
- **Session persistence** - Stay logged in across app restarts
- **No API keys needed** - Uses official web interfaces directly, just web login
- **Zoom controls** - Adjust text size across all views
- **Cross-platform** - macOS (active development), Windows and Linux (buildable from source)

## Getting Started

> **Note:** This repo is under active development. Features are being added and refined regularly.

### Recommended: Run from Source (Always Latest)

Running from source ensures you have the latest features and fixes:

```bash
# Clone the repository
git clone https://github.com/sabyasachis/merged-polygpt.git
cd merged-polygpt

# Install dependencies
npm install

# Start the application
npm start
```

This allows you to:
- Run multiple instances with different provider combinations
- Always use the latest version
- Contribute and customize as needed

### Quick Try: Pre-built macOS Binary

For quick testing without setup, a macOS DMG is available:

**Download:** [Latest macOS Build](https://github.com/sabyasachis/merged-polygpt/releases/latest)

**macOS Installation (2 steps):**
1. Drag PolyGPT to Applications
2. Run in Terminal:
   ```bash
   xattr -cr /Applications/PolyGPT.app
   ```
3. Launch normally

**Note:** The DMG may not always reflect the latest features. Running from source is recommended for the best experience.

**Other Platforms:** Windows and Linux binaries can be built from source using `npm run build`.

## Usage

### Basic Mode
1. Log into your AI providers (ChatGPT, Claude, Gemini, Perplexity) in each quadrant
2. Type your question once in the bottom text box
3. Press Enter to send to all providers simultaneously
4. Compare responses side-by-side

### Merge Mode
1. Click the "Merge" button to enable merge mode
2. Ask your question once
3. All LLMs respond simultaneously in their quadrants
4. The 4th window displays an AI-synthesized answer with citations [1] [2] [3]
5. Follow-up questions continue the merged conversation with context

**Pro Tip:** Instead of reading three separate responses, get one coherent answer combining the best insights from all models.

For detailed usage instructions, see [USAGE.md](USAGE.md).

## License

MIT - See [LICENSE](LICENSE) for details.
