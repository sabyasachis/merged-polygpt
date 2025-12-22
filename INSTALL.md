# PolyGPT Installation Guide for macOS

## Quick Install (Recommended)

After downloading PolyGPT.dmg:

1. **Open the DMG** and drag PolyGPT to Applications
2. **Open Terminal** (Cmd+Space, type "Terminal")
3. **Run this command:**
   ```bash
   xattr -cr /Applications/PolyGPT.app
   ```
4. **Launch PolyGPT** from Applications

Done! The app will now open without warnings.

---

## Why am I seeing security warnings?

macOS Gatekeeper blocks apps that aren't signed with an Apple Developer certificate.

**PolyGPT is safe and open source**, but signing requires a $99/year Apple Developer Program membership. To keep the app free, it's distributed unsigned.

**You can verify the code yourself:** https://github.com/ncvgl/polygpt

---

## Alternative Installation Methods

### Method 1: System Settings (No Terminal)

1. Try to open PolyGPT (you'll get blocked)
2. Go to **System Settings → Privacy & Security**
3. Scroll down to Security section
4. Click **"Open Anyway"** next to the PolyGPT warning
5. Click **Open** to confirm

### Method 2: Right-Click Override

1. **Right-click** (Control+click) on PolyGPT.app
2. Select **Open** from menu
3. Click **Open** in the warning dialog

---

## Still Having Issues?

- Make sure you're on macOS 10.12 or later
- Check that you've dragged the app to Applications (not running from DMG)
- Try restarting your Mac after removing quarantine

**Need help?** Open an issue: https://github.com/ncvgl/polygpt/issues
