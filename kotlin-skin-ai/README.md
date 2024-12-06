# PulpoAR SkinAI Integration

This module provides an example of how to integrate the Pulpoar Skin Analysis Plugin into a Kotlin Android application using a WebView.

## Setup

### 1. Permissions

Ensure you have these permissions in your `AndroidManifest.xml`:

```xml
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
```

### 2. PulpoAR Fragment

The `PulpoARFragment` integrates PulpoAR functionality within a WebView. It handles postMessage events from the WebView and provides methods for interacting with the PulpoAR plugin.

#### Usage

1. Add the `PulpoARFragment` to your activity or fragment:

```kotlin
val pulpoARFragment = PulpoARFragment.newInstance()
supportFragmentManager.beginTransaction()
    .add(R.id.container, pulpoARFragment)
    .commit()
```

## Event Handling

The `PulpoARFragment` listens for postMessage events from the WebView and processes them. Here's how it works:

1. Add a JavaScript Interface to the WebView

The `JSBridge` class is added as a JavaScript interface to enable communication between JavaScript and Kotlin.

```kotlin
class JSBridge(private val listener: (String) -> Unit) {
    @JavascriptInterface
    fun postMessage(message: String) {
        try {
            listener(message)
        } catch (e: Exception) {
            Log.e("PulpoARFragment", "Error in JSBridge: ${e.message}")
        }
    }
}

// Adding the JavaScript interface
webView.addJavascriptInterface(JSBridge { message ->
    activity?.let { activity ->
        activity.runOnUiThread {
            handlePostMessage(message)
        }
    } ?: Log.e("PulpoARFragment", "Activity is null")
}, "JSBridge")

```

2. WebView Client Configuration

```kotlin
webView.webViewClient = object : WebViewClient() {
    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        Log.d("PulpoARFragment", "WebView page loaded and JSBridge is ready.")
    }
}

// Load the WebView content
webView.loadUrl(PLUGIN_URL)

```

3. The `handlePostMessage` method processes messages sent from JavaScript and handles them based on their event_id.

```kotlin
private fun handlePostMessage(message: String) {
    try {
        // Log the raw message
        Log.d("PulpoARFragment", "Received postMessage: $message")

        // Parse the message as JSON
        val jsonObject = JSONObject(message)
        val eventId = jsonObject.optString("event_id")
        val data = jsonObject.optJSONObject("data")?.toString() ?: jsonObject.optString("data")

        // Log the parsed message
        Log.d("PulpoARFragment", "Event ID: $eventId, Data: $data")

        // Handle the event based on eventId
        when (eventId) {
            // Add specific event handling here
            else -> Log.d("PulpoARFragment", "Unhandled event: $eventId")
        }
    } catch (e: Exception) {
        Log.e("PulpoARFragment", "Error parsing postMessage: ${e.message}")
    }
}
```

You can extend the `handlePostMessage` method to add custom behavior for different event types based on the `eventId` and `data` parsed from the message.

## Customization

You can customize the PulpoAR plugin URL by modifying the `BASE_PLUGIN_URL` and `TEMPLATE_ID` constants in the `PulpoARFragment` companion object.
