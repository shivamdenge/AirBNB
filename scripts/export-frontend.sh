#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
OUTPUT_ZIP="${1:-$REPO_ROOT/frontend.zip}"

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "frontend directory not found at: $FRONTEND_DIR" >&2
  exit 1
fi

rm -f "$OUTPUT_ZIP"
(
  cd "$REPO_ROOT"
  zip -r "$OUTPUT_ZIP" frontend -x 'frontend/node_modules/*' 'frontend/dist/*'
)

echo "Created: $OUTPUT_ZIP"
