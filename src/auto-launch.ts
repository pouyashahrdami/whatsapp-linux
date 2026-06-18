import fs from "fs";
import os from "os";
import path from "path";

/**
 * Launch-at-startup support for Linux via a freedesktop autostart entry.
 * Electron's app.setLoginItemSettings is unreliable on Linux, so we manage the
 * ~/.config/autostart/<app-id>.desktop file directly.
 */

const APP_ID = "io.github.pouyashahrdami.WhatsAppDesktop";
const autostartDir = path.join(os.homedir(), ".config", "autostart");
const autostartFile = path.join(autostartDir, `${APP_ID}.desktop`);

export function isAutoLaunchEnabled(): boolean {
    return fs.existsSync(autostartFile);
}

export function setAutoLaunch(enabled: boolean): void {
    if (!enabled) {
        fs.rmSync(autostartFile, { force: true });
        return;
    }

    // Prefer the AppImage path when packaged that way; otherwise the executable.
    const exec = process.env.APPIMAGE || process.execPath;
    const entry = [
        "[Desktop Entry]",
        "Type=Application",
        "Name=WhatsApp Desktop",
        `Exec=${exec} --start-hidden`,
        `Icon=${APP_ID}`,
        "X-GNOME-Autostart-enabled=true",
        ""
    ].join("\n");

    fs.mkdirSync(autostartDir, { recursive: true });
    fs.writeFileSync(autostartFile, entry);
}
