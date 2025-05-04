@echo off
echo Building Anime Watchlist APK...
echo.

:: Build the React app
call npm run build

:: Sync with Android
call npx cap sync android

echo.
echo APK should be built now.
echo.
echo To install on your phone:
echo 1. Connect your phone via USB
echo 2. Enable Developer options and USB debugging on your phone
echo 3. Open the android folder in Android Studio: %CD%\android
echo 4. Click "Run" button in Android Studio to install to your connected device
echo.
echo Alternatively, you can build the APK from Android Studio:
echo 1. Open Android Studio
echo 2. Open this project: %CD%\android
echo 3. Select Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 4. The APK will be in: %CD%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Press any key to open the android folder in Explorer...
pause >nul
start explorer %CD%\android 