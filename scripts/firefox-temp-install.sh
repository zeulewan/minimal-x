#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-"$ROOT/bundle/firefox"}"
START_URL="${START_URL:-https://x.com/home}"
FIREFOX="${FIREFOX:-}"
PROFILE="${PROFILE:-}"
USE_REAL_PROFILE="${USE_REAL_PROFILE:-0}"

if [[ -z "$FIREFOX" ]]; then
  if [[ "$(uname -s)" == "Darwin" && -x "/Applications/Firefox.app/Contents/MacOS/firefox" ]]; then
    FIREFOX="/Applications/Firefox.app/Contents/MacOS/firefox"
  else
    FIREFOX="firefox"
  fi
fi

if [[ ! -f "$SOURCE_DIR/manifest.json" ]]; then
  echo "Firefox bundle missing; building it first."
  (cd "$ROOT" && yarn build:firefox)
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is not installed, so Firefox cannot be started through web-ext."
  echo
  echo "Manual fallback:"
  echo "  1. Open Firefox to about:debugging#/runtime/this-firefox"
  echo "  2. Click 'Load Temporary Add-on...'"
  echo "  3. Select: $SOURCE_DIR/manifest.json"

  if [[ "$(uname -s)" == "Darwin" ]]; then
    if [[ -x "$FIREFOX" ]]; then
      "$FIREFOX" --new-tab "about:debugging#/runtime/this-firefox" >/dev/null 2>&1 || true
    else
      open -a Firefox "about:debugging" || true
    fi
    open -R "$SOURCE_DIR/manifest.json" || true
  fi

  exit 2
fi

args=(
  --yes web-ext run
  --source-dir "$SOURCE_DIR"
  --firefox "$FIREFOX"
  --start-url "$START_URL"
  --no-input
)

if [[ -n "$PROFILE" ]]; then
  args+=(--firefox-profile "$PROFILE")
fi

if [[ "$USE_REAL_PROFILE" == "1" ]]; then
  args+=(--keep-profile-changes)
fi

echo "Starting Firefox with temporary extension from:"
echo "  $SOURCE_DIR"
echo
echo "Firefox:"
echo "  $FIREFOX"
echo

if [[ -n "$PROFILE" && "$USE_REAL_PROFILE" != "1" ]]; then
  echo "Using a copy of profile:"
  echo "  $PROFILE"
  echo
fi

if [[ "$USE_REAL_PROFILE" == "1" ]]; then
  echo "Using the real profile. Firefox must be closed first."
  echo
fi

exec npx "${args[@]}"
