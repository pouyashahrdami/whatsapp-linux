# Roadmap

Modernization and publishing plan for this fork of `whatsapp-desktop-linux`
(an Electron wrapper around https://web.whatsapp.com/).

Status legend: ✅ done · 🚧 in progress · ⬜ planned

---

## Phase 0 — Modernization (done)

- ✅ Electron `21 → 42`, electron-builder `23 → 26`, TypeScript `4.8 → 5.9`.
- ✅ Lockfile regenerated, 0 vulnerabilities, clean `tsc` build.
- ✅ App boots and renders on Electron 42 (verified on Wayland).
- ✅ User-agent now derived from `process.versions.chrome` instead of a hardcoded
  `Chrome/103` string — fixes the "update your browser" page permanently across
  future Electron upgrades. (`src/whatsapp.ts`)
- ✅ `util.ts` no longer crashes when `XDG_DATA_DIRS` is unset.

## Phase 1 — Make the app better

Prioritized. Items near the top are high value / low risk.

- ✅ **Persist zoom level.** Ctrl +/-/0 now persists across restarts via
  `src/module/zoom-module.ts` (restore on load, save on quit).
- ✅ **Spell check.** Enabled `webPreferences.spellcheck` + a right-click context
  menu with suggestions / "Add to dictionary" (`src/module/spellcheck-module.ts`).
- ✅ **Taskbar unread badge.** `app.setBadgeCount(unread)` wired into
  `tray-module.ts` so the count shows on the dock/taskbar too.
- ⬜ **App menu / accelerators.** Menu is currently `null`, so standard
  Copy/Paste/Cut/Select-All accelerators and Find don't work reliably. Add a hidden
  menu with edit roles.
- ⬜ **Download handling.** Show a notification / open-folder action when a file
  finishes downloading (`session.on('will-download')`).
- ⬜ **Harden security model.** Currently `contextIsolation: false` so `preload.ts`
  can override `window.Notification`. Migrate to `contextIsolation: true` +
  `contextBridge`, moving the Notification-click bridge to a safe channel. Medium
  effort, improves security posture (and looks better for Flathub review).
- ⬜ **Wayland niceties.** Auto-detect Wayland and set `--ozone-platform-hint=auto`;
  silence the Vulkan/Wayland GPU warning seen at startup.
- ⬜ **CI build.** GitHub Actions workflow to build the AppImage (+ deb) on tagged
  releases.

## Phase 2 — Rebrand (done)

App ID rebranded from `io.github.mimbrero.WhatsAppDesktop` to
`io.github.pouyashahrdami.WhatsAppDesktop`. Updated:

- ✅ `package.json` → `build.appId` + author
- ✅ `data/io.github.pouyashahrdami.WhatsAppDesktop.appdata.xml` (renamed; `<id>`,
  URLs, `<developer_name>`, `<update_contact>`, screenshot URL, + 2.0.0 release)
- ✅ `data/io.github.pouyashahrdami.WhatsAppDesktop.desktop` (renamed + `Icon=`)
- ✅ icon files renamed under `data/icons/.../`
- ✅ `src/module/tray-module.ts` icon lookups
- ✅ README (credits original author, new clone/release URLs)

> Note: `package.json` `name` and the `.desktop` `Exec`/`StartupWMClass` remain
> `whatsapp-desktop-linux` (the binary identifier); only branding/URLs changed.

## Phase 3 — Publish to your GitHub

- ⬜ `gh auth login`, create repo under your account, re-point `origin`, push.
- ⬜ Tag a release (`v2.0.0`); attach the AppImage (built locally or by CI).

## Phase 4 — Flathub (planned, with a caveat)

> ⚠️ **Duplicate-app risk.** `io.github.mimbrero.WhatsAppDesktop` is *already on
> Flathub*. Flathub reviewers generally reject near-identical duplicates. Options:
> (a) submit our fork anyway and accept possible rejection, or (b) contribute the
> modernization upstream to mimbrero's repo/app instead. Decide before investing in
> the submission.

If we proceed with our own submission:

- ⬜ Write `io.github.<username>.WhatsAppDesktop.yml` manifest (build from the tagged
  git release, not from npm at build time).
- ⬜ Regenerate offline npm sources with `flatpak-node-generator` (see
  `flatpak/generate-sources.sh`) against the new `package-lock.json`.
- ⬜ Validate metainfo: `appstreamcli validate <appdata>.xml`.
- ⬜ Test-build locally with `flatpak-builder` against `org.freedesktop.Platform`
  (current runtime, e.g. 24.08) + `org.electronjs.Electron2.BaseApp`.
- ⬜ Open a PR against `flathub/flathub` on a `new-pr` branch and respond to review.

---

## Notes / decisions

- **electron-store** is pinned to `^8` (last CommonJS line). v9+ is ESM-only;
  migrating the whole app to ESM is deferred — it would require `"type": "module"`,
  `.js` import extensions, and dropping `__dirname`. Revisit if/when we move to ESM.
- The `flatpak/flatpak-builder-tools` git submodule is only needed to run
  `flatpak-node-generator`; it isn't part of the app build.
