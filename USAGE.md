# PolyGPT - Usage Guide

## 🚀 Quick Start

### Running the Production App
1. **Open the DMG:**
   ```bash
   open dist/PolyGPT-0.2.5-universal.dmg
   ```

2. **Drag PolyGPT.app to Applications folder**

3. **Launch the app:**
   - Double-click PolyGPT in Applications folder
   - OR from terminal: `open /Applications/PolyGPT.app`

### Running in Development Mode
```bash
cd /Users/sasah14/projects/code/polygpt
npm start
```

This will:
- Launch the app with hot-reload
- Show console logs in the terminal
- Allow you to test changes immediately

---

## 🔧 Development Commands

### Install Dependencies
```bash
npm install
```

### Start Development Mode
```bash
npm start
```

### Build for Production
```bash
npm run build
```

This creates:
- `dist/PolyGPT-0.2.5-universal.dmg` - Universal binary (Intel + Apple Silicon)
- `dist/mac-universal/PolyGPT.app` - The app bundle

---

## ✨ New Features (v0.2.5)

### 1. **Auto/Manual Merge Toggle**
- **Auto-Merge ON (default):** Automatically merges when all 3 responses complete
- **Auto-Merge OFF:** Shows "✨ Ready to Merge!" button with pulsing glow, click to merge manually

### 2. **Smart Stop Button Detection**
- Accurately detects when AI responses complete
- Waits for streaming to finish before marking complete
- Works on ChatGPT, Claude, Gemini, and Perplexity

### 3. **Retry Mechanism**
- If a response takes longer than 30 seconds, starts retrying every 2 seconds
- Prevents stuck states
- Automatically completes when response finishes

### 4. **Smart Citations in Merged Answers**
The merge prompt now generates citations in two forms:

**With sources:**
- `**[1: Nature 2023]**` - Cites specific paper from Window 1
- `**[2: arxiv.org/1234]**` - Cites URL from Window 2
- `**[3: WHO Guidelines]**` - Cites document from Window 3

**Without sources (LLM analysis):**
- `**[1]**` - Window 1 generated insight
- `**[2]**` - Window 2 analysis

---

## 🎮 How to Use

### Basic Usage
1. **Enable Merge Mode:** Check "🔀 Merge Mode" in the control bar
2. **Select Merger Window:** Choose which window will receive the merged answer (default: Bottom-Right)
3. **Choose Auto/Manual:** Toggle "⚡ Auto-Merge" based on preference
4. **Type your question** in the input box
5. **Press Enter** to submit to all windows
6. **Wait for responses** to complete (watch the counter: "0/3 responses received")
7. **Merged answer appears** in the merger window

### Keyboard Shortcuts
- `Enter` - Submit message
- `Shift+Enter` - New line
- `Cmd+Option+I` - Open DevTools (development mode)

### Control Bar Features
- **Merge Mode Toggle:** Enable/disable merge mode
- **Auto-Merge Toggle:** Choose automatic or manual merge triggering
- **Merger Window Selector:** Pick which window receives merged answers
- **Timeout Selector:** How long to wait before auto-merging (1min - ∞)
- **Merge Now Button:** Manually trigger merge (useful in manual mode)
- **New Chat Button:** Start fresh conversation in all windows
- **Refresh Button:** Reload all pages
- **Zoom Controls:** Adjust zoom level
- **Theme Toggle:** Switch between dark/light mode

---

## 📊 Window Layout

```
┌─────────────┬─────────────┐
│  Window 1   │  Window 2   │
│  (topLeft)  │ (topRight)  │
│  Gemini     │   Claude    │
├─────────────┼─────────────┤
│  Window 3   │  Window 4   │
│(bottomLeft) │(bottomRight)│
│  ChatGPT    │ Gemini      │
│             │  (MERGER)   │
└─────────────┴─────────────┘
```

**Default Setup:**
- Windows 1, 2, 3: Respond to questions
- Window 4 (bottomRight): Receives merged answer

---

## 🐛 Troubleshooting

### Stop Button Not Detected
1. Open DevTools: `Cmd+Option+I`
2. Go to Console tab
3. Type: `polygptDebugStopButton()`
4. Check if stop button selectors are finding the element

### Response Not Completing
- Check console for "⚠️ Stop button still present" warnings
- The retry mechanism will keep trying every 2 seconds
- Maximum wait time is 30 seconds, then retry starts

### Merge Not Triggering
- Verify merge mode is enabled
- Check that exactly 3 non-merger windows completed (look for "3/3" in status)
- Check console for "[Merge] Performing merge operation"

### Auto-Merge Timing Issues
- Adjust the timeout setting (default: 5 minutes)
- Use manual merge mode if you prefer manual control

---

## 📁 Project Structure

```
polygpt/
├── src/
│   ├── main/
│   │   └── index.js          # Main Electron process (merge logic)
│   ├── preload/
│   │   ├── chatgpt-preload.js
│   │   ├── claude-preload.js
│   │   ├── gemini-preload.js
│   │   ├── perplexity-preload.js
│   │   └── shared-preload-utils.js  # Stop button detection
│   └── renderer/
│       ├── index.html        # Control bar UI
│       ├── renderer.js       # Control bar logic
│       └── styles.css        # Styling
├── config/
│   └── selectors.json        # DOM selectors for each AI provider
├── dist/                     # Build output
└── package.json
```

---

## 🔐 Settings Location

Settings are stored in:
```
~/Library/Application Support/polygpt/merge-settings.json
```

Contains:
- `mergeModeEnabled`: boolean
- `mergerWindow`: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
- `mergeTimeout`: number (seconds, -1 for infinite)
- `autoMerge`: boolean

---

## 📝 Version History

### v0.2.5 (Current)
- ✅ Added auto/manual merge toggle
- ✅ Implemented stop button detection for accurate response completion
- ✅ Added retry mechanism to prevent stuck states
- ✅ Improved merge prompt with smart citations (sources + window numbers)
- ✅ Fixed premature completion bugs
- ✅ Fixed duplicate "stop button disappeared" logging

### v0.2.4
- Previous version (see git history)

---

## 🙋 Support

For issues or questions:
1. Check the console logs in DevTools
2. Review the troubleshooting section above
3. Check GitHub issues: https://github.com/anthropics/claude-code/issues

---

## 📄 License

See LICENSE file in project root.
