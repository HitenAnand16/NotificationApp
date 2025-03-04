import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, TextInput, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
const navigationRef = React.createRef(); // Ref for navigation

// Home Screen: Sends message & triggers notification
function HomeScreen({ navigation }) {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      setMessage("");
      return;
    }

    // Trigger push notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Message 📩',
        body: message,
        data: { message },
        sound: 'default',
        badge: 1, // 🔥 Set badge count here
      },
      trigger: { seconds: 5 },
    });

    // Navigate to NotificationScreen with the message
    // navigation.navigate('NotificationScreen', { message });
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

// Notification Screen: Displays received message
function NotificationScreen({ route }) {
  const { message } = route.params || {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Received Notification</Text>
      <Text style={{ marginTop: 10 }}>{message || 'No message received'}</Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  
    // Listen for notifications while the app is open
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', JSON.stringify(notification, null, 2));
    });
  
    // Handle notification tap when the app is in the background or closed
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const message = response.notification.request.content.data?.message;
      if (message) {
        navigationRef.current?.navigate('NotificationScreen', { message });
      }
    });
  
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
  

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert('Error', 'Must use a physical device for push notifications.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Error', 'Failed to get push token for notifications.');
    return;
  }

  try {
    // Fetch the Expo Push Token (for remote notifications)
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    // TODO: Send this token to your backend for remote push notifications
    return token;
  } catch (error) {
    console.error('Error fetching push token:', error);
  }
}
