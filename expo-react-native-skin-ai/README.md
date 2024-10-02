# Expo Skin Analysis App Example

This project is an example of how to use the Pulpoar Skin Analysis Plugin in an Expo React Native app.

Please note that you need to have Android Studio or Xcode installed on your machine to run the app in an emulator or on a device.

> **Note:** The core integration with the event listening function is implemented in `app/index.tsx`. The following steps are only necessary for setting up and running the Expo app.

Here's an example code snippet of how to handle events like "Add to Cart" or "Go to Product" in the result page, implemented in `app/index.tsx`:

```typescript
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const onMessageReceived = (event: WebViewMessageEvent | MessageEvent<any>) => {
  try {
    let data: any;

    if ('nativeEvent' in event) {
      data = event.nativeEvent.data;
    } else {
      console.error('Unexpected event structure:', event);
      return;
    }

    if (typeof data === 'string' && data.startsWith('event_id:')) {
      console.log('Received string data:', data);
      const [eventId, eventData] = data.split('|');
      const key = eventId.split(':')[1];
      const value = eventData.split(':')[1];
      // Handle the event data as needed
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

<WebView
  source={{ uri: PLUGIN_URL }}
  style={{ flex: 1 }}
  onMessage={onMessageReceived}
/>;
```

## 1. Install dependencies

```bash
npm install
```

## 2. Customize the template ID

This app uses a default `TEMPLATE_ID` for demonstration purposes. To use your own Pulpoar Skin Analysis Plugin, you need to update the `TEMPLATE_ID` in the `app/index.tsx` file.

To do this:

1. Open `app/index.tsx`
2. Locate the following line:
   ```typescript
   const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   ```
3. Replace the value with your own template ID provided by Pulpoar.

Ensure you have the correct template ID to properly integrate your specific Skin Analysis Plugin.

## 3. Android and iOS Permissions

This app requires camera and storage permissions. In Expo, you can set these permissions in two ways:

1. Directly in the `app.json` file:

   For Android:

   ```json
   "android": {
     "permissions": [
       "CAMERA",
       "READ_EXTERNAL_STORAGE",
       "WRITE_EXTERNAL_STORAGE"
     ]
   }
   ```

   For iOS:

   ```json
   "ios": {
     "infoPlist": {
       "NSCameraUsageDescription": "This app needs access to the camera to complete the skin analysis after the user has taken a photo."
     }
   }
   ```

2. Or in the respective platform-specific files:
   - For Android: in `android/app/src/main/AndroidManifest.xml`
   - For iOS: in `ios/<YourProjectName>/Info.plist`

It is already set up in the `app.json` file.

## 4. Prebuild the project (One-time setup)

Before a native app can be compiled, the native source code needs to exist. Prebuild generates the native source code for the project.

### For Android:

```bash
npx expo prebuild --platform android
```

### For iOS:

```bash
npx expo prebuild --platform ios
```

This command will generate the necessary Android and iOS folders. For more information about the prebuild process, refer to the official Expo documentation: https://docs.expo.dev/workflow/prebuild/

## 5. Create a Custom Development Build

When working with Expo and adding custom native code or libraries (e.g., react-native-webview or other native modules), you'll need to build a custom development build using Expo Dev Client. This step is crucial for ensuring that all native dependencies are properly integrated.

### For Android:

1. Open Android Studio and start an Android Virtual Device (AVD) if you don't already have one running.
2. In a terminal, run the following command:

```bash
npx expo run:android
```

This command will start the app on your Android emulator.

### For iOS:

1. Open Xcode and ensure you have a simulator running or connect a physical iOS device.
2. In a terminal, run the following command:

```bash
npx expo run:ios
```

This command will start the app on your iOS simulator or physical device.
