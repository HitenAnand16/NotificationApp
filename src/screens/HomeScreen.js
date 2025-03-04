import React, { useState } from 'react';
import { Text, View, Button, TextInput, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function HomeScreen({ navigation }) {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      setMessage('');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Message 📩',
        body: message,
        data: { message },
        sound: 'default',
        badge: 1,
      },
      trigger: { seconds: 5 },
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text>Enter Message:</Text>
      <TextInput
        style={{
          width: '80%',
          height: 40,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
          marginVertical: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Type your message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
}
