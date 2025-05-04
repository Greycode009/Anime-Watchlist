#!/bin/bash

# Exit on error
set -e

# Set working directory to the project root
cd "$(dirname "$0")/.."

# Create logs directory
mkdir -p scripts/logs

# Output log file
LOG_FILE="scripts/logs/build-$(date +%Y%m%d-%H%M%S).log"

echo "Starting optimized Android build process..."
echo "Log file: $LOG_FILE"

# 1. Clean up previous builds
echo "Cleaning up previous builds..."
rm -rf build/
rm -rf android/app/build/
rm -rf android/app/src/main/assets/public/

# 2. Install dependencies if needed
if [ "$1" == "--install" ]; then
  echo "Installing dependencies..."
  npm install >> "$LOG_FILE" 2>&1
fi

# 3. Build optimized web assets
echo "Building optimized web assets..."
GENERATE_SOURCEMAP=false npm run build >> "$LOG_FILE" 2>&1

# 4. Run optimization scripts
echo "Optimizing assets..."
node scripts/optimize-assets.js >> "$LOG_FILE" 2>&1

# 5. Update capacitor
echo "Updating Capacitor..."
npx cap sync android >> "$LOG_FILE" 2>&1

# 6. Build Android app
echo "Building Android app..."
cd android

# Debug build
if [ "$1" == "--debug" ] || [ "$2" == "--debug" ]; then
  echo "Building debug APK..."
  ./gradlew assembleDebug --stacktrace >> "../$LOG_FILE" 2>&1
  
  echo "Debug APK built successfully!"
  echo "APK location: $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
  APK_SIZE=$(du -h "app/build/outputs/apk/debug/app-debug.apk" | cut -f1)
  echo "APK size: $APK_SIZE"
# Release build (default)
else
  echo "Building release APK..."
  ./gradlew assembleRelease --stacktrace >> "../$LOG_FILE" 2>&1
  
  echo "Release APK built successfully!"
  echo "APK location: $(pwd)/app/build/outputs/apk/release/app-release-unsigned.apk"
  APK_SIZE=$(du -h "app/build/outputs/apk/release/app-release-unsigned.apk" | cut -f1)
  echo "APK size: $APK_SIZE"
  
  # Build App Bundle for Play Store (smaller download size)
  echo "Building App Bundle (AAB)..."
  ./gradlew bundleRelease --stacktrace >> "../$LOG_FILE" 2>&1
  
  echo "App Bundle built successfully!"
  echo "AAB location: $(pwd)/app/build/outputs/bundle/release/app-release.aab"
  AAB_SIZE=$(du -h "app/build/outputs/bundle/release/app-release.aab" | cut -f1)
  echo "AAB size: $AAB_SIZE"
fi

# Return to project root
cd ..

echo "Build process completed!"
echo "Check $LOG_FILE for details" 