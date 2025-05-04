# Installing Anime Watchlist App on Your Phone

Follow these steps to install the app on your Android device:

## Option 1: Using Android Studio (Recommended)

1. **Prepare your phone:**
   - Enable "Developer options" on your phone by going to Settings > About phone and tapping "Build number" 7 times
   - Enable "USB debugging" in Developer options
   - Connect your phone to your computer with a USB cable
   - Accept any debugging prompts on your phone

2. **Open the project in Android Studio:**
   - Open Android Studio on your computer
   - Select "Open an Existing Project"
   - Navigate to and select the `android` folder in this project

3. **Run the app directly to your phone:**
   - Select your phone from the device dropdown in Android Studio
   - Click the Run button (green play icon)
   - The app will be installed and launched on your device

## Option 2: Building and transferring the APK

1. **Build the APK:**
   - Run the `build-and-install.bat` file in this directory by double-clicking it
   - This will build the web app and create an APK

2. **Install the APK:**
   - Connect your phone to your computer via USB cable
   - Enable file transfer on your phone
   - Copy the APK file from `android/app/build/outputs/apk/debug/app-debug.apk` to your phone
   - On your phone, use a file manager to find and tap the APK file
   - Follow the prompts to install the app
   - You may need to enable "Install from unknown sources" in your phone's security settings

## Troubleshooting

If you encounter any issues:

- Make sure your phone is properly connected and USB debugging is enabled
- Check that developer options are enabled on your phone
- Try restarting your phone and computer
- Ensure the APK is properly built by checking for any error messages

## App Features

- Browse and manage your anime watchlist
- Track watched episodes and ratings
- Search for anime titles
- Optimized performance and small app size 