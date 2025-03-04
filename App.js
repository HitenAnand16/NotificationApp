// App.js
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';
import NotificationScreen from './src/screens/NotificationScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
const navigationRef = React.createRef();

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', JSON.stringify(notification, null, 2));
      console.log('Notification Received Time:', Date.now());
    });
  
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
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    // TODO: Send this token to your backend for remote push notifications
    return token;
  } catch (error) {
    console.error('Error fetching push token:', error);
  }
}


