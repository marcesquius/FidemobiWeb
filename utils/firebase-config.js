/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  /* TODO: ADD YOUR FIREBASE CONFIGURATION OBJECT HERE */
  apiKey: "AIzaSyC2z0Iz2neFV8DCnNJi8qHrtTIZoDYRqJ8",
  authDomain: "fidemobi-4dade.firebaseapp.com",
  projectId: "fidemobi-4dade",
  storageBucket: "fidemobi-4dade.appspot.com",
  messagingSenderId: "917953518823",
  appId: "1:917953518823:web:568d9fbf262b896a6e1642",
  measurementId: "G-X4GJQ5GVWP"
};

/** CUPOTIX
 const firebaseConfig = {
	apiKey: "AIzaSyBweATLu2WZI4uecXGXl0rm7K0QsirZa0Y",
	authDomain: "cupotix-d1c19.firebaseapp.com",
	databaseURL: "https://cupotix-d1c19.firebaseio.com",
	projectId: "cupotix-d1c19",
	storageBucket: "cupotix-d1c19.appspot.com",
	messagingSenderId: "996430804446",
	appId: "1:996430804446:web:fc47e982c1d6975c38994f",
	measurementId: "G-1VW95ZF5MC",
	storageBucket: "cupotix-d1c19.appspot.com",
};
 */

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}