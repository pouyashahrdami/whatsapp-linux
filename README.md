# WhatsApp Desktop for Linux (unofficial)

A WhatsApp Linux client built with Electron. As WhatsApp doesn't ship an official
app for Linux, this is an unofficial build that wraps the official web client.

> This is a modernized fork of
> [mimbrero/whatsapp-desktop-linux](https://github.com/mimbrero/whatsapp-desktop-linux)
> (updated to current Electron, with a few extra features).

## 📜 Disclaimer
This just loads https://web.whatsapp.com/ with some extra features, never changing
the content of the official webpage (html, css nor javascript). It runs the official
web client.

This wrapper is not verified by, affiliated with, or supported by WhatsApp Inc.

## ✨ Features
- Runs WhatsApp Web in a native desktop window
- System tray with unread-chat count, minimize-to-tray, and start hidden
- Unread count as a taskbar/dock badge
- Spell checking with right-click suggestions
- Zoom (Ctrl +/-/0) remembered across restarts
- Desktop notifications that focus the window on click

## 💾 Installation
### AppImage
The AppImage build is attached to each release. Check the
[releases page](https://github.com/pouyashahrdami/whatsapp-linux/releases).
Download the `.AppImage` file, mark it as executable and double-click it.

## :hammer: CLI arguments
- `--start-hidden`: starts WhatsApp hidden in tray.

## :construction: Development
PRs and forks are welcome!

1. Clone the repo
```bash
git clone https://github.com/pouyashahrdami/whatsapp-linux.git
cd whatsapp-linux
```

2. Install dependencies
```bash
npm install
```

3. Run or build
```bash
npm start      # compile and run
npm run build  # compile and build an AppImage
```

See [ROADMAP.md](ROADMAP.md) for what's planned next.
