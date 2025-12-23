# Bug Tracking & Future Features

**Last Updated:** 2024-12-22
**Version:** 0.2.7

---

## 🐛 Bugs Fixed in v0.2.7

### Critical Bugs

#### **Bug #1: Response Completion Blocked After First Message**
**Severity:** CRITICAL
**Status:** ✅ FIXED in v0.2.7

**Symptom:**
- After first response completes, all subsequent responses never trigger completion
- Merge mode stuck at 2/3 or 1/3 forever
- No completion events sent to merge system

**Root Cause:**
- `checkStopButton.completionScheduled` flag set to `true` on first completion
- Flag never reset, blocking all future completion attempts
- Located in `src/preload/shared-preload-utils.js:832`

**Fix Applied:**
```javascript
setTimeout(() => {
  sendCompletion();
  // Reset flag after completion
  checkStopButton.completionScheduled = false;
}, 500);
```

**Files Changed:**
- `src/preload/shared-preload-utils.js:838-840`

---

#### **Bug #2: Claude Response Detection Capturing Intercom Widget**
**Severity:** CRITICAL
**Status:** ✅ FIXED in v0.2.7

**Symptom:**
- Claude responses detected as "Intercom CSS widget" (5167 chars of CSS)
- Wrong content sent to merge system
- Merge never completes (Claude never marked as complete)

**Root Cause:**
- Configured selectors (`div[class*='font-claude']`) failed to find response initially
- Auto-discovery fallback picked first element with >50 chars text
- Intercom widget (`div.intercom-lightweight-app`) matched before actual response

**Fix Applied:**
1. **Excluded Intercom widgets from auto-discovery:**
```javascript
// Exclude Intercom widget and similar UI elements
const className = typeof el.className === 'string' ? el.className : (el.className?.baseVal || '');
if (className.includes('intercom-') || className.includes('widget-') || className.includes('launcher-')) return false;
```

2. **Updated Claude response selectors (prioritized most specific):**
```json
"response": [
  "div.font-claude-response",    // Most specific
  "div.standard-markdown",       // For standard responses
  "div.progressive-markdown",    // For progressive rendering
  ...
]
```

**Files Changed:**
- `src/preload/shared-preload-utils.js:598-600`
- `config/selectors.json:140-151`

---

### Medium Priority Bugs

#### **Bug #3: Selector Suggestions Only Logged Once**
**Severity:** MEDIUM
**Status:** ✅ FIXED in v0.2.7

**Symptom:**
- Selector suggestions only appear on first response detection
- Debugging website changes becomes difficult after initial startup

**Root Cause:**
- `extractLatestResponse.lastSelectorLog` timestamp set permanently
- Prevented all future logging

**Fix Applied:**
```javascript
const now = Date.now();
const shouldLog = !extractLatestResponse.lastSelectorLog || (now - extractLatestResponse.lastSelectorLog) > 60000;
```

**Files Changed:**
- `src/preload/shared-preload-utils.js:632-635`

---

#### **Bug #4: SVG className Crash Risk**
**Severity:** LOW
**Status:** ✅ FIXED in v0.2.7

**Symptom:**
- Potential crashes when processing SVG elements
- `className.split()` called on `SVGAnimatedString` object instead of string

**Root Cause:**
- SVG elements have `className` as object type (`SVGAnimatedString`), not string
- Code assumed all elements have string className

**Fix Applied:**
```javascript
const className = typeof el.className === 'string'
  ? el.className
  : (el.className?.baseVal || '');
```

**Files Changed:**
- `src/preload/shared-preload-utils.js:639-640`
- `src/preload/shared-preload-utils.js:1033-1035`

---

## ⚠️ Known Issues (Not Yet Fixed)

### Performance Issues

#### **Issue #1: Stop Button Detection Inefficiency**
**Severity:** LOW (Non-blocking)
**Status:** ⏳ WORKAROUND IN PLACE

**Symptom:**
- Responses wait for 30-second timeout instead of detecting stop button disappearance
- Completions still work, but with unnecessary delay

**Observed Behavior:**
```
[Claude] ⚠️ Stop button still present, not completing yet (×14 times)
[Claude] Max wait time reached, attempting completion
[Claude] Response complete (932 chars)  ← Still works!
```

**Analysis:**
- Stop buttons ARE detected initially ✓
- DOM monitoring interval (~200ms) may be catching button during state transition
- Button might flicker or temporarily reappear during streaming
- Timeout (30s) acts as safety net and completes successfully

**Impact:**
- Adds 30-second delay before merge triggers
- Does NOT break functionality
- User experience slightly slower but reliable

**Proposed Fix (Future):**
1. Add debouncing to stop button detection (wait 500ms after disappearance)
2. Reduce check frequency from 200ms to 500ms
3. Add state machine to track button lifecycle (appearing → visible → disappearing → gone)

**Files to Modify:**
- `src/preload/shared-preload-utils.js:787-840` (checkStopButton function)

---

#### **Issue #2: Claude Selectors Not Matching During Monitoring**
**Severity:** LOW (Auto-discovery works)
**Status:** ⏳ INVESTIGATION NEEDED

**Symptom:**
- Health checks FIND elements with configured selectors
- Real-time monitoring DOESN'T find same elements
- Auto-discovery fallback activates (works correctly now)

**Evidence:**
- Health check: `✓ response: Found with selector "div[class*='prose']"`
- Monitoring: `[claude] No response elements found. Tried selectors: ...`
- Auto-discovery: `[claude] Auto-discovered 2 response elements` (correct elements)

**Analysis:**
- Timing issue: Elements appear after monitoring checks start
- OR: Elements exist in different context (iframe, shadow DOM)
- OR: CSS selectors have specificity issues with dynamic content

**Proposed Investigation:**
1. Add timestamp logging to see when elements actually appear in DOM
2. Check if response elements are in shadow DOM or iframe
3. Try more generic selectors like `div[class*="font-"]`
4. Add MutationObserver specifically for response container

**Recommended Selector Update:**
```json
"response": [
  "div.font-claude-response",
  "div[class*='font-claude-']",  // More permissive
  "div.standard-markdown",
  "div.progressive-markdown",
  "div[class*='markdown']",
  "[class*='prose']"              // Even more generic
]
```

**Files to Investigate:**
- `src/preload/shared-preload-utils.js:553-675` (extractLatestResponse)
- `src/preload/claude-preload.js:102-189` (debug function shows elements exist)

---

## 🚀 Potential Features

### High Priority Features

#### **Feature #1: Adaptive Selector System**
**Priority:** HIGH
**Status:** 💡 PROPOSED

**Description:**
Learn and adapt selectors based on what auto-discovery finds successfully.

**Benefits:**
- Reduce reliance on auto-discovery
- Improve performance (auto-discovery is expensive)
- Self-healing when websites change

**Implementation:**
1. When auto-discovery succeeds, analyze which selector would match
2. Store successful selectors in cache (in-memory or file)
3. Try cached selectors before configured selectors
4. Periodically save learned selectors to config

**Pseudo-code:**
```javascript
const learnedSelectors = {};

function extractLatestResponse(provider, config) {
  // Try learned selectors first
  if (learnedSelectors[provider]) {
    const element = document.querySelector(learnedSelectors[provider]);
    if (element) return extractFromElement(element);
  }

  // Try configured selectors...
  // ...

  // Auto-discovery as last resort
  if (candidates.length > 0) {
    const topCandidate = candidates[0];
    // Learn the selector
    const selector = generateSelector(topCandidate);
    learnedSelectors[provider] = selector;
    console.log(`[${provider}] Learned new selector: ${selector}`);
  }
}
```

**Files to Create:**
- `src/utils/selector-learning.js` (new)

**Files to Modify:**
- `src/preload/shared-preload-utils.js:553-675`

---

#### **Feature #2: Stop Button Debouncing**
**Priority:** MEDIUM
**Status:** 💡 PROPOSED

**Description:**
Add debouncing to stop button detection to avoid catching transitional states.

**Implementation:**
```javascript
let stopButtonDisappearTimer = null;

function checkStopButton() {
  const stopButton = findElement(config[provider]?.stopButton);

  if (stopButton && !isStreaming) {
    // Button appeared
    isStreaming = true;
    if (stopButtonDisappearTimer) {
      clearTimeout(stopButtonDisappearTimer);
      stopButtonDisappearTimer = null;
    }
  } else if (!stopButton && isStreaming) {
    // Button disappeared - wait 500ms to confirm
    if (!stopButtonDisappearTimer) {
      stopButtonDisappearTimer = setTimeout(() => {
        // Confirm button still gone
        const stillGone = !findElement(config[provider]?.stopButton);
        if (stillGone) {
          console.log('✓ Stop button confirmed disappeared');
          setTimeout(() => sendCompletion(), 500);
        }
        stopButtonDisappearTimer = null;
      }, 500);
    }
  }
}
```

**Files to Modify:**
- `src/preload/shared-preload-utils.js:787-840`

---

### Medium Priority Features

#### **Feature #3: Health Check Alerts**
**Priority:** MEDIUM
**Status:** 💡 PROPOSED

**Description:**
Show user-facing alerts when health checks detect broken selectors.

**Benefits:**
- User knows when website changes break functionality
- Can report issues proactively
- Reduces support burden

**Implementation:**
1. Create notification system in renderer process
2. When health check score < 80%, show warning banner
3. Include recommendations from health check
4. Add "Report Issue" button that opens GitHub issue with diagnostics

**Files to Create:**
- `src/renderer/notifications.js` (new)

**Files to Modify:**
- `src/main/index.js:483-527` (forward health data to renderer)
- `src/renderer/renderer.js` (add notification UI)

---

#### **Feature #4: Selector Update Command**
**Priority:** LOW
**Status:** 💡 PROPOSED

**Description:**
Developer command to update selectors.json based on health check recommendations.

**Usage:**
```bash
npm run update-selectors
```

**Implementation:**
1. Run health checks
2. Parse recommendations
3. Update selectors.json with suggested selectors
4. Validate new selectors
5. Backup old config

**Files to Create:**
- `scripts/update-selectors.js` (new)

---

## 📋 Testing Notes

### Manual Test Results (v0.2.7)

**Test 1:**
- ✅ All 3 providers detected responses
- ✅ Merge triggered (3/3 complete)
- ✅ Merged response: 3047 chars
- ⚠️ Claude/Gemini used 30s timeout (see Issue #1)

**Test 2:**
- ✅ All 3 providers detected responses
- ✅ Merge triggered (3/3 complete)
- ✅ Merged response: 3023 chars
- ⚠️ Claude/Gemini used 30s timeout (see Issue #1)

**Overall:** All core functionality working correctly. Performance optimization opportunities identified.

---

## 🔄 Version History

### v0.2.7 (2024-12-22)
**Theme:** Health Monitoring & Bug Fixes

**Added:**
- Proactive health check system for all providers
- Auto-discovery fallback with improved filtering
- Selector suggestion logging (throttled to 60s)
- Enhanced debug functions for Claude/Gemini

**Fixed:**
- Critical: Response completion blocked after first message
- Critical: Claude detecting Intercom widget instead of response
- Medium: Selector suggestions only logged once
- Low: SVG className crash risk

**Changed:**
- Updated Claude response selectors (prioritized specificity)
- Improved auto-discovery filters (exclude widgets, CSS, hidden elements)
- Enhanced error handling for className access

**Performance:**
- Health checks run automatically 12s after startup
- Overall health: 63% (expected due to website changes)
- Response detection working via auto-discovery

**Known Issues:**
- Stop button detection using timeout fallback (30s delay)
- Claude selectors not matching during monitoring (auto-discovery works)

---

## 📚 Related Documentation

- `CLAUDE.md` - Project overview and architecture
- `USAGE.md` - User guide and merge mode documentation
- `config/selectors.json` - Selector configuration
- `src/preload/shared-preload-utils.js` - Core detection logic

---

## 🤝 Contributing

When fixing bugs or adding features:

1. **Document in this file** before implementing
2. **Test manually** with at least 2 different queries
3. **Check logs** for errors/warnings
4. **Update version history** when committing
5. **Consider backward compatibility** with older configs

---

## 📞 Support

For bug reports and feature requests:
- GitHub Issues: https://github.com/sabyasachis/merged-polygpt/issues
- Include: Version number, logs, and steps to reproduce
