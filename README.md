<p align="center">
  <img width="80px" alt="Minimal X App Icon" src=".github/assets/MoreMinimalXIcon.png" />
</p>

<h1 align="center">
  Minimal X
</h1>

Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/minimal-x-twitter/). For Chrome, Edge, and Safari, see [manual installation](./MANUAL_INSTALLATION.MD).

Canonical repository: [zeulewan/minimal-x](https://github.com/zeulewan/minimal-x).

![Hero](.github/assets/hero.png)

**Minimal X** is a browser extension originally made by [Thomas Wang](https://www.linkedin.com/in/xinganwang/), developed further by the [Typefully](https://typefully.com/?ref=minimal-twitter) team, with the marketing-free fork by [Kainoa Newton](https://github.com/notkainoa). This edition is maintained by [Zeul](https://github.com/zeulewan). To contribute / see development instructions, go to [CONTRIBUTING](./.github/CONTRIBUTING.md).

## Description

Refine and clean up the X interface, and customize your experience:

- Default to the "Following" timeline
- Hide the sticky Timeline header
- Remove the new view counts
- Remove the distracting trends sidebar
- Customize your Timeline width
- Remove Timeline borders for a more minimal look
- Customize the left navigation
- Hide view count and vanity counts under tweets
- Remove promoted posts
- Remove "Who to Follow" and other suggestions
- Hide the Search Bar
- Hide the Tweet button
- Hide Grok AI elements
- And more...

## No typefully marketing/features

The biggest thing changed from [Typefully's version](https://github.com/typefully/minimal-twitter) is the removal of any marketing, features, or advertising for Typefully


## Development and diagnostics

Build with Yarn Classic 1.22.22: `yarn install --frozen-lockfile`, then
`yarn build:all`. Run `yarn test` for regression checks. `yarn scan:build`
generates the read-only X selector diagnostic in `diagnostics/scan-x.js`.
Missing matches mean an element is not present on the current page, not that
its feature is obsolete.

See [Firefox release instructions](./AMO_SOURCE_README.md) for source packaging
and public store submissions. The Firefox extension ID is preserved across
repository renames so existing installations can receive updates.
