/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useEffect, useState } from 'react';
import firebase from 'react-native-firebase';

var config = {
  apiKey: "AIzaSyB1J_RksrTiLuPAf-DVpRnld2UqDFCYO9Y",
  authDomain: "notificationpoc-8c82a.firebaseapp.com",
  databaseURL: "https://notificationpoc-8c82a.firebaseio.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


const App: () => React$Node = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  let onNotificationHandler;
  useEffect(() => {

    var starCountRef = database.ref('user1');
    starCountRef.on('value', function (snapshot) {
      setValue(snapshot.val())
    });

    firebase.auth()
      .signInAnonymously()
      .then(credential => {
        if (credential) {
          console.log(credential.user.toJSON())
        }
      });
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log({ fcmToken })
        } else {
          // user doesn't have a device token yet
        }
      });

    (async function () {
      const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        console.log({ notificationOpen })
      }
    })()
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("yes")
        } else {
          console.log("no")
        }
      });

    firebase.messaging().onMessage((message) => {
      // alert(message)
    });

    firebase.notifications().onNotificationDisplayed((notification) => {
      console.log("pa")
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    onNotificationHandler = firebase.notifications().onNotification((notification) => {
      // Process your notification as required
      console.log("da", notification);
      notification.android.setChannelId("testqw")
      firebase.notifications().displayNotification(notification)
    });
    firebase.notifications().onNotificationOpened((notification) => {
      // Process your notification as required
      console.log("opend", notification)
    });

    return () => {
      onNotificationHandler();
    }
  }, [])

  const updateFireBase=()=>{
    var starCountRef = database.ref('user1');
    starCountRef.set(value2)
  }
  return (
    <View>
      <Text>{value}</Text>
      <TextInput onChangeText={setValue2}  />
      <Button title="Update"  onPress={updateFireBase}/>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
