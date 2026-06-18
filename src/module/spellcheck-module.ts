import { BrowserWindow, Menu, MenuItem } from 'electron';
import Module from './module';

/**
 * Adds a right-click context menu with spelling suggestions, "Add to dictionary"
 * and the standard editing actions. Electron's spellchecker is enabled by default;
 * this just surfaces it to the user.
 */
export default class SpellCheckModule extends Module {

    constructor(private readonly window: BrowserWindow) {
        super();
    }

    public override onLoad() {
        const webContents = this.window.webContents;

        webContents.on("context-menu", (_event, params) => {
            const menu = new Menu();

            for (const suggestion of params.dictionarySuggestions) {
                menu.append(new MenuItem({
                    label: suggestion,
                    click: () => webContents.replaceMisspelling(suggestion)
                }));
            }

            if (params.misspelledWord) {
                if (params.dictionarySuggestions.length > 0)
                    menu.append(new MenuItem({ type: "separator" }));

                menu.append(new MenuItem({
                    label: "Add to dictionary",
                    click: () => webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                }));
                menu.append(new MenuItem({ type: "separator" }));
            }

            if (params.isEditable || params.selectionText) {
                if (params.isEditable)
                    menu.append(new MenuItem({ role: "cut" }));
                if (params.selectionText)
                    menu.append(new MenuItem({ role: "copy" }));
                if (params.isEditable)
                    menu.append(new MenuItem({ role: "paste" }));
            }

            if (menu.items.length > 0)
                menu.popup({ window: this.window });
        });
    }
};
