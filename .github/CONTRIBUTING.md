# Contributing

Report bugs and propose improvements in [this repository's issues](https://github.com/zeulewan/minimal-x/issues).

## Build and test

Install [Yarn Classic 1.22.22](https://classic.yarnpkg.com/lang/en/docs/install/).
From the repository root:

```sh
yarn install --frozen-lockfile
yarn build:all
yarn test
```

The build installs locked dependencies, builds the Next.js popup and Rollup
content script once, and packages Chrome and Firefox under `bundle/`.
Use `yarn build:firefox` or `yarn build:chrome` for a single browser.
`yarn build:safari` requires macOS and Xcode and generates
`bundle/safari/Minimal X/Minimal X.xcodeproj`.

For development, run `yarn dev` inside `popup/` or `yarn watch` inside
`content-scripts/`. Rebuild the browser package before loading it to pick up
changes. See [manual installation](../MANUAL_INSTALLATION.MD).

Selectors live in `content-scripts/src/selectors.js`. After changing them,
run `yarn scan:build` and commit `diagnostics/scan-x.js`. The scan only reports
matches on the current page; use actual behavior checks before removing features.

See [Firefox release instructions](../AMO_SOURCE_README.md) for publishing and
reproducible source archives.
