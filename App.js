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
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useEffect } from 'react';
import firebase from 'react-native-firebase';

const App: () => React$Node = () => {

  let onNotificationHandler;
  useEffect(() => {
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
          console.log({fcmToken})
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
      alert(message)
    });

    firebase.notifications().onNotificationDisplayed((notification) => {
      console.log("pa")
      alert(100)
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    onNotificationHandler = firebase.notifications().onNotification((notification) => {
      // Process your notification as required
      console.log("da");
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
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
