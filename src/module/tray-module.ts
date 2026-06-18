import { app, BrowserWindow, Menu, MenuItem, Tray } from "electron";
import { isAutoLaunchEnabled, setAutoLaunch } from "../auto-launch";
import Settings from "../settings";
import { findIcon, getUnreadMessages } from "../util";
import WhatsApp from "../whatsapp";
import Module from "./module";

const ICON = findIcon("io.github.pouyashahrdami.WhatsAppDesktop.png");
const ICON_UNREAD = findIcon("io.github.pouyashahrdami.WhatsAppDesktop-unread.png");

const preferences = new Settings("preferences");

export default class TrayModule extends Module {

    private readonly tray: Tray;

    constructor(
        private readonly whatsApp: WhatsApp,
        private readonly window: BrowserWindow
    ) {
        super();
        this.tray = new Tray(ICON);
    }

    public override onLoad() {
        this.updateMenu();
        this.registerListeners();
    }

    private updateMenu(unread: number = getUnreadMessages(this.window.title)) {
        const menu = Menu.buildFromTemplate([
            {
                label: this.window.isVisible() ? "Minimize to tray" : "Show WhatsApp",
                click: () => this.onClickFirstItem()
            },
            { type: "separator" },
            {
                label: "Preferences",
                submenu: [
                    {
                        label: "Launch at startup",
                        type: "checkbox",
                        checked: isAutoLaunchEnabled(),
                        click: item => setAutoLaunch(item.checked)
                    },
                    {
                        label: "Start minimized",
                        type: "checkbox",
                        checked: preferences.get("startMinimized", false),
                        click: item => preferences.set("startMinimized", item.checked)
                    },
                    {
                        label: "Close to tray",
                        type: "checkbox",
                        checked: preferences.get("closeToTray", true),
                        click: item => preferences.set("closeToTray", item.checked)
                    }
                ]
            },
            { type: "separator" },
            {
                label: "Quit WhatsApp",
                click: () => this.whatsApp.quit()
            }
        ]);

        let tooltip = "WhatsApp Desktop";

        if (unread != 0) {
            menu.insert(0, new MenuItem({
                label: unread + " unread chats",
                enabled: false
            }));

            menu.insert(1, new MenuItem({ type: "separator" }));

            tooltip = tooltip + " - " + unread + " unread chats";
        }

        this.tray.setContextMenu(menu);
        this.tray.setToolTip(tooltip);
    }

    private onClickFirstItem() {
        if (this.window.isVisible()) {
            this.window.hide();
        } else {
            this.window.show();
            this.window.focus();
        }

        this.updateMenu();
    }

    private registerListeners() {
        // Left-click the tray icon to toggle the window (where the desktop's
        // tray implementation emits click events; many Linux indicators don't).
        this.tray.on("click", () => this.onClickFirstItem());

        this.window.on("show", () => this.updateMenu());
        this.window.on("hide", () => this.updateMenu());

        this.window.on("close", event => {
            if (this.whatsApp.quitting) return;

            if (!preferences.get("closeToTray", true)) {
                this.whatsApp.quit();
                return;
            }

            event.preventDefault();
            this.window.hide();
        });

        this.window.webContents.on("page-title-updated", (_event, title, explicitSet) => {
            if (!explicitSet) return;

            let unread = getUnreadMessages(title);

            this.updateMenu(unread);
            this.tray.setImage(unread == 0 ? ICON : ICON_UNREAD);
            app.setBadgeCount(unread);
        });
    }
};
