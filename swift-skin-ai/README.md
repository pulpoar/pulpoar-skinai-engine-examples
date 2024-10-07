# PulpoAR SkinAI Integration

This module provides an example of how to integrate the Pulpoar Skin Analysis Plugin into a Swift iOS application using a WebView.

### 1. Setup Permissions in Info.plist

Add the lines below to give permission for camera in Info.plist.

```html
<key>NSCameraUsageDescription</key>
<string>Your reason for accessing the camera.</string>
```

### 2. PulpoAR View

The PulpoARView is a UIViewController that loads the PulpoAR plugin into a WKWebView.

#### Usage

To use the PulpoAR view in your SwiftUI app, simply include the `PulpoARViewRepresentable` in your view hierarchy:

```swift
struct ContentView: View {
    var body: some View {
        PulpoARViewRepresentable()
            .edgesIgnoringSafeArea(.all)
    }
}
```

### 3. Event Handling

The PulpoARView now uses a WKScriptMessageHandler to receive events from the WebView. Events are processed in the `handlePostMessage(_:)` method. Here's how events are structured and handled:

1. Events are received as object.
2. The `handlePostMessage(_:)` method parses this payload.
3. You can then handle specific events based on the event ID.

Example of how events are processed:

```swift
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard message.name == "jsHandler" else {
        print("Received message from unknown handler: \(message.name)")
        return
    }

    // Ensure the message body is a dictionary
    guard let messageDict = message.body as? [String: Any] else {
        print("Message body is not a dictionary. Received: \(message.body)")
        return
    }

    // Extract the event_id and data fields from the dictionary
    guard let eventId = messageDict["event_id"] as? String else {
        print("Message does not contain a valid 'event_id'. Received: \(messageDict)")
        return
    }

    // Check if data is a string or a dictionary (object)
    var data: String? = nil
    if let dataDict = messageDict["data"] as? [String: Any] {
        // Convert dictionary to string if needed
        if let jsonData = try? JSONSerialization.data(withJSONObject: dataDict, options: []),
        let jsonString = String(data: jsonData, encoding: .utf8) {
            data = jsonString
        } else {
            print("Failed to serialize 'data' to JSON string. Received: \(dataDict)")
            return
        }
    } else if let dataString = messageDict["data"] as? String {
        data = dataString
    } else {
        print("Message does not contain a valid 'data' field. Received: \(messageDict)")
        return
    }

    // Log the event_id and data for debugging
    print("Event ID: \(eventId), Data: \(data ?? "No data")")
}
```

To handle specific events, you can extend the `handlePostMessage(_:)` method to include custom logic for each event type. For example:

```swift
switch validEventId {
case "<add_to_cart_event_id>":
    // Handle add to cart event
    break
// Add more cases for other event types
default:
    print("Unhandled event: \(validEventId)")
}
```
