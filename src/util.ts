import { nativeImage } from "electron";
import fs from "fs";
import path from "path";

export function findIcon(name: string) {
    const relative = path.join("icons/hicolor/512x512/apps", name);

    const candidates = [
        // Bundled next to the executable (electron-builder extraFiles: "data").
        path.join(path.dirname(process.execPath), "data", relative),
        // Running from source (cwd is the project root).
        path.join("data", relative),
        // System-installed icon themes.
        ...dataDirs().map(dir => path.join(dir, relative))
    ];

    const iconPath = candidates.find(fs.existsSync) ?? candidates[0];
    return nativeImage.createFromPath(iconPath);
}

export function getUnreadMessages(title: string) {
    const matches = title.match(/\(\d+\) WhatsApp/);
    return matches == null ? 0 : Number.parseInt(matches[0].match(/\d+/)[0]);
}

function dataDirs() {
    return (process.env.XDG_DATA_DIRS || "/usr/local/share:/usr/share").split(":");
}
