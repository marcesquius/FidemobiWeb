
'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js'

//import { initializeApp } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	//createUserWithEmailAndPassword,
	signOut,
  } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';

import { getFirebaseConfig } from './firebase-config.js';

var user = null;

export const signIn = (email, password) => {
	signInWithEmailAndPassword(getAuth(), email, password)
	.then((userCredential) => {
		console.log('SignIn by Function')
		window.location = 'escritorio/escritorio.html';
	}).catch((error) => {
		console.log(error.code, error.message);
	});	
}

// Initiate firebase auth
export function initFirebaseAuth() {
	// TODO 3: Subscribe to the user's signed-in status
	//onAuthStateChanged(getAuth(), authStateObserver);
	onAuthStateChanged(getAuth(), (user) =>{
		//user = getAuth().currentUser.email;
		//if (getAuth().currentUser != null){
		if (user != null){
			window.location = 'escritorio/escritorio.html';
		}
		//console.log(getAuth().currentUser.email)
	});
}

// Signs-out of Friendly Chat.
export function signOutUser() {
	// TODO 2: Sign out of Firebase.
	signOut(getAuth()).then(() => {
		// Sign-out successful.
		console.log('User Logged Out!');
		window.location = '/';
	  }).catch(function(error) {
		// An error happened.
		console.log(error);
	  });;
  }

const firebaseAppConfig = getFirebaseConfig();
// TODO 0: Initialize Firebase
initializeApp(firebaseAppConfig);
//initFirebaseAuth();


