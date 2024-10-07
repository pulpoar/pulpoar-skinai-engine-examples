import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const BASE_PLUGIN_URL = 'https://booster.pulpoar.com/engine/v0/';
const TEMPLATE_ID = '65d729ee-163c-4c53-b9a8-2a5314bf1caa';
const PLUGIN_URL = BASE_PLUGIN_URL + TEMPLATE_ID;

export default function Index() {
  const [message, setMessage] = useState<any>(null);

  const onMessageReceived = (
    event: WebViewMessageEvent | MessageEvent<any>
  ) => {
    try {
      // Extract the data from the event
      const data = 'nativeEvent' in event ? event.nativeEvent.data : null;
      if (!data) {
        console.error('Unexpected event structure or empty data:', event);
        return;
      }

      // Try parsing the data if it's a string
      let parsedData = data;
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data);
        } catch (error) {
          console.error('Failed to parse message as JSON:', data);
          return;
        }
      }

      // Ensure the parsed data is an object with event_id and data properties
      const { event_id, data: eventData } = parsedData || {};
      if (typeof event_id !== 'string' || eventData === undefined) {
        console.error(
          'Invalid message format, expected an object with event_id and data:',
          parsedData
        );
        return;
      }

      // Event handling logic (based on event_id)
      console.log(`Received event: ${event_id} with data:`, eventData);
      setMessage({ eventId: event_id, data: eventData });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 100,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          padding: 10,
        }}>
        <ScrollView>
          <Text style={{ padding: 5 }}>{JSON.stringify(message, null, 2)}</Text>
        </ScrollView>
      </View>
      <WebView
        source={{ uri: PLUGIN_URL }}
        style={{ flex: 1 }}
        onMessage={onMessageReceived}
      />
    </View>
  );
}
