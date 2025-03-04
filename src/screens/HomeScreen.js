// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, StyleSheet, Animated, ImageBackground } from 'react-native';
import * as Notifications from 'expo-notifications';

const HomeScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(1)); // Initial button animation value
  
  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      setMessage("");
      return;
    }
  
    const triggerDate = new Date(Date.now() + 5000); // 5 seconds from now
  
    console.log('Sending message:', message);
    console.log('Current Time:', Date.now());
    console.log('Trigger Date:', triggerDate);
  
    // Trigger push notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Message 📩',
        body: message,
        data: { message },
        sound: 'default',
        badge: 1,
      },
      trigger: { date: triggerDate }, // Set exact date for the notification
    });
  
    console.log('Notification scheduled with ID:', notificationId);
    console.log('Scheduled Time:', triggerDate);
  
    // Button bounce animation
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };
  

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View>
      <View style={styles.container}>
        <Animated.View style={{ ...styles.innerContainer, opacity: fadeAnim }}>
          <Text style={styles.header}>Enter Message:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
          />
          <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
              <Text style={styles.buttonText}>Send Message</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    width: '100%',
    height: 30,
    backgroundColor: '#ff7f50',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal:30
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
