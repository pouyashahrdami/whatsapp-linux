import { BrowserWindow, globalShortcut } from "electron";
import Module from "./module";

const ACCELERATOR = "CommandOrControl+Alt+W";

/**
 * Registers a system-wide hotkey (Ctrl+Alt+W) to show/hide the window from
 * anywhere, even when WhatsApp isn't focused.
 */
export default class GlobalHotkeyModule extends Module {

    constructor(private readonly window: BrowserWindow) {
        super();
    }

    public override onLoad() {
        const registered = globalShortcut.register(ACCELERATOR, () => this.toggle());
        if (!registered)
            console.warn(`Could not register global shortcut ${ACCELERATOR} (already in use?)`);
    }

    public override onQuit() {
        globalShortcut.unregister(ACCELERATOR);
    }

    private toggle() {
        if (this.window.isVisible() && this.window.isFocused()) {
            this.window.hide();
        } else {
            this.window.show();
            this.window.focus();
        }
    }
};
