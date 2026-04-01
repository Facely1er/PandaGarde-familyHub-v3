#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/2] Running DFA-focused test suite"
npm run test:dfa

echo "[2/2] Building production bundle"
npm run build

echo "Done. DFA tests passed and production build succeeded."
