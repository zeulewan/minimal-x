# AMO source submission notes

This source package builds the Firefox extension package submitted to AMO.

## Environment used

- Node.js: 22.22.0
- Yarn: 1.22.22
- OS used for this package: Linux x86_64

The project uses classic Yarn and includes lockfiles for the root package, the popup package, and the content-scripts package.

## Build steps

From the repository root:

```sh
yarn install --frozen-lockfile
yarn build:firefox
```

The build script:

1. Builds the popup in `popup/` with Next.js static export.
2. Builds the content script in `content-scripts/` with Rollup.
3. Copies extension assets into `bundle/firefox/`.
4. Writes the Firefox `manifest.json`.
5. Creates `bundle/firefox.zip`.

## Expected output

The AMO upload package is:

```text
bundle/firefox.zip
```

The listing metadata used with `web-ext sign --channel=listed` is:

```text
amo-metadata.json
```

The popup Next.js build ID is pinned in `popup/next.config.js` so exported files are written under:

```text
bundle/firefox/next/static/more-minimal-twitter/
```

## Lint status

Validated with:

```sh
npx --yes web-ext lint --source-dir bundle/firefox
```

Current result: 0 errors, 0 notices. Remaining warnings are generated Next.js runtime chunk warnings for `Function` constructor and `innerHTML` usage.

## Data collection

The Firefox manifest declares:

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

This matches the privacy policy: preferences are stored locally on the user's device and the extension does not collect or transmit user data.
