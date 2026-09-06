# Minimal X 0.6 — Mozilla source submission

Source repository: https://github.com/zeulewan/more-minimal-twitter

This is the source for the existing Minimal X Firefox listing (Gecko ID
`{f718b762-bd7e-47d2-901f-e9057339c52a}`). It preserves its local-only operation,
branding, default preferences, and permissions. No remote code is loaded.

## Reproduce the package

Environment used: macOS arm64, Node.js 26.0.0, Yarn Classic 1.22.22.
All three packages include Yarn lockfiles. From the source archive root:

```sh
yarn install --frozen-lockfile --non-interactive
yarn build:firefox
```

This installs locked popup and content-script dependencies, lints the popup,
exports the Next.js popup, compiles the Rollup content script, and packages
`bundle/firefox.zip`. Compare extracted files rather than ZIP timestamps.
The Next.js build ID is pinned to `more-minimal-twitter` in `popup/next.config.js`.
No API keys, environment files, or private services are needed to build.

## Verification

```sh
yarn test
yarn scan:build
npx --yes web-ext lint --source-dir bundle/firefox
```

22 regression tests cover storage persistence, popup hydration/editor behavior,
Home feed selection, Hide For You scoping, CSS cascade, title notifications,
Grok listener/observer cleanup, mutation handling, startup, and the read-only
selector scanner. They use DOM fixtures; they do not establish compatibility
with every live X page or locale.

Mozilla web-ext validation: 0 errors, 0 notices, 10 warnings, all in generated
Next.js/React runtime chunks (Function constructor or innerHTML). These are
bundled dependencies, not remotely downloaded extension code. The original
source and lockfiles are supplied so reviewers can inspect/rebuild them.

## Changes in 0.6

- Persist rapid independent setting changes without dropping writes.
- Avoid saving defaults when opening the popup; keep controls synchronized.
- Save custom CSS immediately and preserve edits when reopening the editor.
- Apply custom CSS without requiring a removed external stylesheet; retain its cascade priority.
- Reuse styles, event listeners, and observers across X DOM updates.
- Scope Following and Hide For You to identified Home tabs instead of guessing tab positions.
- Restore title counts when the option is re-enabled and handle missing favicon/title elements.
- Read a complete settings snapshot for updates, preserving sidebar and drawer controls.
- Compile once for multiple browser targets and support noninteractive builds.

## Data collection

The manifest declares `data_collection_permissions.required: ["none"]`.
Preferences and custom CSS remain in Firefox local extension storage. The
extension does not collect or transmit user data. The optional diagnostic
`diagnostics/scan-x.js` only counts selector matches on the current page and is
not shipped as an automatically running content script.

## Future store updates

Use the signed-in Mozilla Developer Hub → Minimal X → New Version → Change →
On this site. Upload `bundle/firefox.zip`, then this source archive, and provide
release notes/reviewer build instructions. The previous 0.5 upload was unlisted;
choose **On this site** to update the public listing. Increase the version in
`bundle-extension.js` for each submission.
