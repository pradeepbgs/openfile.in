#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

BUILD_TYPE="${1:-release}"

if command -v brew >/dev/null && brew --prefix openjdk@17 >/dev/null 2>&1; then
  export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

echo "Generating native android/ project..."
npx expo prebuild --platform android

echo "Building APK (${BUILD_TYPE})..."
BUILD_TYPE_CAP="$(printf '%s' "$BUILD_TYPE" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
cd android
./gradlew "assemble${BUILD_TYPE_CAP}"

echo "Done. APK at: android/app/build/outputs/apk/${BUILD_TYPE}/"
