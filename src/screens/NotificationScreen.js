import React from 'react';
import { Text, View } from 'react-native';

export default function NotificationScreen({ route }) {
  const { message } = route.params || {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Received Notification</Text>
      <Text style={{ marginTop: 10 }}>{message || 'No message received'}</Text>
    </View>
  );
}
