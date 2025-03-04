// src/screens/NotificationScreen.js
import React from 'react';
import { Text, View, StyleSheet, ImageBackground, Animated } from 'react-native';

const NotificationScreen = ({ route }) => {
  const { message } = route.params || {};
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
      <View style={styles.container}>
        <Animated.View style={{ ...styles.innerContainer, opacity: fadeAnim }}>
         <View style={{flexDirection:"row", alignItems:"center"}}>
         <View style={{width:10,height:10,backgroundColor:"white", borderRadius:100, marginRight:10}}></View>
         <Text style={styles.header}>Received Notification</Text>
         </View>
          <Text style={styles.message}>{message || 'No message received'}</Text>
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 20,
    borderRadius: 10,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    borderColor:"black",
    borderWidth:1,
  },
  header: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#fff',
  },
});

export default NotificationScreen;
