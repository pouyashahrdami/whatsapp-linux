import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import ChromeVersionFix from "./fix/chrome-version-fix";
import Electron21Fix from "./fix/electron-21-fix";
import GlobalHotkeyModule from "./module/global-hotkey-module";
import HotkeyModule from "./module/hotkey-module";
import ModuleManager from "./module/module-manager";
import SpellCheckModule from "./module/spellcheck-module";
import TrayModule from "./module/tray-module";
import WindowSettingsModule from "./module/window-settings-module";
import ZoomModule from "./module/zoom-module";
import Settings from "./settings";

const preferences = new Settings("preferences");

// Derive the user agent from the bundled Chromium version so WhatsApp Web never
// shows the "update your browser" page after an Electron upgrade.
const USER_AGENT = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

export default class WhatsApp {

    private readonly window: BrowserWindow;
    private readonly moduleManager: ModuleManager;
    public quitting = false;

    constructor() {
        this.window = new BrowserWindow({
            title: "WhatsApp",
            width: 1100,
            height: 700,
            minWidth: 650,
            minHeight: 550,
            show: !process.argv.includes("--start-hidden") && !preferences.get("startMinimized", false),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false, // native Notification override in preload :(
                spellcheck: true
            }
        });

        this.moduleManager = new ModuleManager([
            new Electron21Fix(),
            new HotkeyModule(this, this.window),
            new TrayModule(this, this.window),
            new WindowSettingsModule(this, this.window),
            new ZoomModule(this.window),
            new SpellCheckModule(this.window),
            new GlobalHotkeyModule(this.window),
            new ChromeVersionFix(this)
        ]);
    }

    public init() {
        this.makeLinksOpenInBrowser();
        this.registerListeners();

        this.moduleManager.beforeLoad();

        this.window.setMenu(null);
        this.window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT });

        this.moduleManager.onLoad();
    }

    public reload() {
        this.window.webContents.reloadIgnoringCache();
    }

    public quit() {
        this.quitting = true;
        this.moduleManager.onQuit();
        app.quit();
    }
    
    private makeLinksOpenInBrowser() {
        this.window.webContents.setWindowOpenHandler(details => {
            if (details.url != this.window.webContents.getURL()) {
                shell.openExternal(details.url);
                return { action: 'deny' };
            }
        });
    }

    private registerListeners() {
        app.on('second-instance', () => {
            this.window.show();
            this.window.focus();
        });

        ipcMain.on('notification-click', () => this.window.show());
    }
};
