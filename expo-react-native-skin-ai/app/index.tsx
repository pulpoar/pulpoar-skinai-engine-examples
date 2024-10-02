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
      let data: any;

      if ('nativeEvent' in event) {
        data = event.nativeEvent.data;
      } else {
        console.error('Unexpected event structure:', event);
        return;
      }

      // Handling mobile specific string message
      if (typeof data === 'string' && data.startsWith('event_id:')) {
        console.log('Received string data:', data);
        const [eventId, eventData] = data.split('|');
        const key = eventId.split(':')[1];
        const value = eventData.split(':')[1];
        setMessage({ eventId: key, data: value });
      }
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
        }}
      >
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
