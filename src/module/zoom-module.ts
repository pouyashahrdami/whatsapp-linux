import { BrowserWindow } from 'electron';
import Settings from '../settings';
import Module from './module';

const settings = new Settings("zoom");

/**
 * Persists the zoom level (changed with Ctrl +/-/0) across restarts.
 * Mirrors WindowSettingsModule: restore on load, save on quit.
 */
export default class ZoomModule extends Module {

    constructor(private readonly window: BrowserWindow) {
        super();
    }

    public override onLoad() {
        this.window.webContents.setZoomLevel(settings.get("level", 0));
    }

    public override onQuit() {
        settings.set("level", this.window.webContents.getZoomLevel());
    }
};
