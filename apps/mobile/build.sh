#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PROFILE="${1:-preview}"

echo "Building Android APK (profile: $PROFILE)..."
eas build --platform android --profile "$PROFILE"
