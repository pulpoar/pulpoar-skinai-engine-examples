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

1. Events are received as strings in the format: `"event_id:XYZ | data:ABC"`
2. The `handlePostMessage(_:)` method parses this string to extract the event ID and data.
3. You can then handle specific events based on the event ID.

Example of how events are processed:

```swift
private func handlePostMessage(_ message: String) {
    let parts = message.components(separatedBy: " | ")
    guard parts.count == 2 else {
        print("Invalid message format: \(message)")
        return
    }

    let eventIdPart = parts[0].split(separator: ":")
    let dataPart = parts[1].split(separator: ":")

    guard eventIdPart.count == 2, dataPart.count == 2 else {
        print("Invalid key-value pair in message: \(message)")
        return
    }

    let eventId = eventIdPart.last?.trimmingCharacters(in: .whitespaces)
    let data = dataPart.last?.trimmingCharacters(in: .whitespaces)

    guard let validEventId = eventId, let validData = data else {
        print("Failed to extract event_id or data from message: \(message)")
        return
    }

    print("Event ID: \(validEventId), Data: \(validData)")
    // Handle specific events based on the eventId here
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
