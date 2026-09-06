# Install manually

For a persistent Firefox installation, use the [Minimal X store listing](https://addons.mozilla.org/en-US/firefox/addon/minimal-x-twitter/).

Build the packages from this repository:

```sh
yarn install --frozen-lockfile
yarn build:all
```

Generated packages are `bundle/chrome.zip` and `bundle/firefox.zip`. Build
outputs are not committed to GitHub.

## Chrome or Edge

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable Developer mode.
3. Choose Load unpacked and select `bundle/chrome`.

## Firefox development

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose Load Temporary Add-on.
3. Select `bundle/firefox/manifest.json`.

Temporary installations are removed when Firefox restarts. Public store
packages are signed by Mozilla; a locally built ZIP is not a signed release.

## Safari development

On macOS with Xcode, run `yarn build:safari`, then open
`bundle/safari/Minimal X/Minimal X.xcodeproj` and run the app.
See Apple's [Safari extension development instructions](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension).
