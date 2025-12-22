# merged-polygpt

Interact with multiple AI assistants simultaneously and get AI-synthesized answers with merge mode - reducing cognitive load when comparing ChatGPT, Claude, Gemini, and Perplexity responses.

## Demo

![merged-polygpt Demo](docs/demo.gif)

## Features

- **4-way split view** - ChatGPT, Claude, Gemini, and Perplexity in a 2x2 grid
- **Unified input** - Type once, send to all providers simultaneously
- _**AI-Synthesized Responses**_ - Get one coherent answer combining insights from multiple LLMs
- _**Automatic Citations**_ - Each point is cited [1] [2] [3] to show which model contributed
- _**Reduced Cognitive Load**_ - No more mentally synthesizing three different answers
- _**Follow-up Context**_ - Continue merged conversations with maintained context
- **Provider switching** - Change any quadrant to a different provider on the fly
- **Supersize mode** - Expand any quadrant to 80% width for focused work
- **Session persistence** - Stay logged in across app restarts
- **No API keys needed** - Uses official web interfaces directly, just web login
- **Zoom controls** - Adjust text size across all views
- **Cross-platform** - macOS (active development), Windows and Linux (buildable from source)

_Merge mode inspired by Andrej Karpathy's "LLM council" concept._

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

For detailed usage instructions, see [USAGE.md](USAGE.md).

## License

MIT - See [LICENSE](LICENSE) for details.

---

**Author:** Sabyasachi Sahoo (ssahoo.infinity@gmail.com)
