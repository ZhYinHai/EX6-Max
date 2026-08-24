#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
archive="$project_root/phanteks-ex6-page.zip"
staging=$(mktemp -d)
plugin_dir="$staging/phanteks-ex6-page"

cleanup() {
  rm -rf "$staging"
}
trap cleanup EXIT INT TERM

mkdir -p "$plugin_dir"
cp "$project_root/phanteks-ex6-page.php" "$project_root/README.md" "$plugin_dir/"
cp -R "$project_root/templates" "$project_root/assets" "$plugin_dir/"

rm -f "$archive"
(cd "$staging" && zip -qr "$archive" phanteks-ex6-page -x '*.DS_Store')

echo "Created $archive"
