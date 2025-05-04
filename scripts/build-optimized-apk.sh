#!/bin/bash

# Build optimized APK script
echo "Building optimized Android APK..."

# Stop on errors
set -e

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf build
rm -rf android/app/build

# Build optimized React app
echo "Building optimized React app..."
npm run build:small

# Run asset optimizations 
echo "Optimizing assets..."
npm run optimize

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Build the Android app
echo "Building Android app..."
cd android
./gradlew clean

# Build release APK
echo "Building release APK..."
./gradlew assembleRelease

# Build app bundle for Play Store
echo "Building App Bundle..."
./gradlew bundleRelease

# Output APK location
echo "Optimized APK built successfully!"
echo "APK location: android/app/build/outputs/apk/release/app-release.apk"
echo "Bundle location: android/app/build/outputs/bundle/release/app-release.aab"

# Print APK size
echo "APK size: $(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)"

# Return to root directory
cd ..

echo "Build process completed!" 