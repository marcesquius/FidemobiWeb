'use strict';

//import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js'

import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js';

import { 
	getFirestore, 
	collection, 
	onSnapshot, 
	addDoc, 
	getDocs, 
	getDoc, 
	updateDoc, 
	deleteDoc, 
	doc, 
	query, 
	where, 
	GeoPoint 
  } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

import { Geohash as gh } from "../utils/geoHash.js";

import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js";
 
import { getFirebaseConfig } from './firebase-config.js';

var user = null;

//const firebaseAppConfig = getFirebaseConfig();
// TODO 0: Initialize Firebase
//initializeApp(firebaseAppConfig);
//initFirebaseAuth();

const firebaseAppConfig = getFirebaseConfig();
var app = initializeApp(firebaseAppConfig);
const  auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initiate firebase auth
export function initFirebaseAuth() {
	// TODO 3: Subscribe to the user's signed-in status
	//onAuthStateChanged(getAuth(), authStateObserver);
	onAuthStateChanged(getAuth(), (user) =>{
		//user = getAuth().currentUser.email;
		//if (getAuth().currentUser != null){
		if (user != null){
			window.location = 'main/main.html';
		}
	});
}

export {
	auth,
	onAuthStateChanged,
}

// USER
export const signIn = (email, password) => {
	signInWithEmailAndPassword(getAuth(), email, password)
	.then((userCredential) => {
		console.log('SignIn by Function')
		window.location = 'main/main.html';
	}).catch((error) => {
		var errorModal= document.getElementById("errorModal");
		var errorModalPopup = new bootstrap.Modal(errorModal, {});
		errorModalPopup.show();
	});	
}

// Signs-out of Fidemobi
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

// PLACES
export const getPlaceId = (id) => id; //console.log(id);

export const getPlace = (id) => getDoc(doc(db, 'places', id));

export const onGetPlaces = (callback) => {
	const placesRef = collection(db, 'places')
	const queryRef = query(placesRef, where("editor", "==", auth.currentUser.email));
	onSnapshot(queryRef, callback)
}

export const savePlace = (isDemo, company, name, address, phone, lat, lon, tags) => {
	const user = auth.currentUser;
	addDoc(collection(db, 'places'), {
		address: address,
		company: company,
		editor: user.email,
		isDemo: isDemo,
		name: name,
		phone: phone,
		point: { "geohash": gh.encode(lat, lon), "geopoint": new GeoPoint(lat, lon) },
		position: new GeoPoint(lat, lon),
		tags: tags,
	});
}

export const updatePlace = (id, newFields) => {
	//console.log(newFields.address)
	const updateFields = {
		address: newFields.address,
		company: newFields.company,
		editor: auth.currentUser.email,
		isDemo: newFields.isChecked,
		name: newFields.name,
		phone: newFields.phone,
		point: { "geohash": gh.encode(newFields.lat, newFields.lon), "geopoint": new GeoPoint(newFields.lat, newFields.lon) },
		position: new GeoPoint(newFields.lat, newFields.lon),
		tags: newFields.mtags,
	}
	updateDoc(doc(db, 'places', id), updateFields)
}

/**
 *
 // https://firebase.google.com/docs/web/learn-more#available-libraries
// https://firebase.google.com/docs/reference/js/storage.uploadmetadata

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, GeoPoint } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";
import { Geohash as gh } from "./geoHash.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js";

// https://firebase.google.com/docs/web/setup



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
	auth,
	onAuthStateChanged,
	db,
	onSnapshot,
	collection,
	getStorage,
	ref,
	listAll,
	getDownloadURL,
	uploadBytesResumable,
}



//const storageRef = ref(storage);
//const iconsStorage = ref(storage,'icons');

//const gh = Geohash();

//const apikey = require('config')(functions.config().config.apikey)

export const uploadImage = (file) => {
	const storage = getStorage();
	const storageRef = ref(storage, 'demo/' + file.name);

	// 'file' comes from the Blob or File API
	uploadBytes(storageRef, file).then((snapshot) => {
		console.log('Uploaded a blob or file!');
	});
}

export const fullUploadImage = (file) => {
	const storage = getStorage();

	// Create the file metadata
	/** @type {any} *
	const metadata = {
		contentType: 'image/jpeg'
	};

	// Upload file and metadata to the object 'images/mountains.jpg'
	const storageRef = ref(storage, 'demo/' + file.name);
	const uploadTask = uploadBytesResumable(storageRef, file, metadata);
	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on('state_changed',
		(snapshot) => {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			// A full list of error codes is available at
			// https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case 'storage/unauthorized':
					// User doesn't have permission to access the object
					console.log('storage/unauthorized');
					break;
				case 'storage/canceled':
					// User canceled the upload
					console.log('storage/canceled');
					break;

				// ...

				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					console.log('storage/unknown')
					break;
			}
		},
		() => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log('File available at', downloadURL);
			});
		}
	);
}

export const listImages = (dir) => {
	const storage = getStorage();

	// Create a reference under which you want to list
	const listRef = ref(storage, dir);

	var arrImg = ["Saab", "Volvo", "BMW"];

	// Find all the prefixes and items.
	listAll(listRef)
	  .then((res) => {
		res.prefixes.forEach((folderRef) => {
			console.log('FOLDERS')
			console.log(folderRef)
		  // All the prefixes under listRef.
		  // You may call listAll() recursively on them.
		});
		res.items.forEach((itemRef, index) => {
			//console.log('ITEMS')
			//console.log(itemRef)
			//console.log(index)
			var dirr = dir + '/' + itemRef.name;
			//console.log(dirr);
			var starsRef = ref(storage, dirr);
			// Get the download URL
			getDownloadURL(starsRef)
				.then((url) => {
					arrImg.push(dirr.toString())
					//arrImg.push(URLToArray(url));
					//arrImg[index] = url;
					//console.log(url);
					// Insert url into an <img> tag to "download"
				})
		  // All the items under listRef.
		});
	  }).catch((error) => {
		console.log('ERROR')
		console.log(error)
		// Uh-oh, an error occurred!
	  });
	  //console.log(arrImg)

	  const cars = ["Saab", "Volvo", "BMW"];
	  //return cars;
	  return arrImg;
}

export const statusChanged = () => {
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			console.log("Status: Logged!!", user);
			email = user.email;
			return 1
			//getDocs(collection(db, 'products'));
		} else {
			console.log("Status: NO Logged");
			return 0
		}
	})

}

export const saveProducts = (name, price) => {
	const user = auth.currentUser;
	console.log(user.email, user.uid, name, price);
	addDoc(collection(db, 'products'), {
		owner: user.email,
		name: name,
		price: price,
	});
}



export const savePromo = (placeId, newfields) => {
	addDoc(collection(db, 'places', placeId, 'promotion'), newfields);
}

// SIGNUP 
export const signUpFunction = (email, password) => {
	// SIGNUP
	const signupForm = document.querySelector('#signup-form');
	createUserWithEmailAndPassword(auth, email, password)
		.then(userCredential => {
			// clear the form
			signupForm.reset();

			// close the modal
			var myModalEl = document.getElementById('signupmodal');
			var modal = bootstrap.Modal.getInstance(myModalEl)
			modal.hide();

			console.log('sign Up by function');
			//console.log(userCredential.email, userCredential.password)
			// SIGNIN
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Signed in 
					//const user = userCredential.user;
					const uid = userCredential.uid;
					console.log("SignIn automatically after SIGNUP by function");
					// ...
					addDoc(collection(db, 'products'), {
						name: email,
						password: password,
					});
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
				});

		})
}

// SIGNIN - LOGIN
export const signInFunction = (email, password) => {
	const signinForm = document.querySelector('#login-form');
	//console.log(email,password);
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// clear the form
			signinForm.reset();

			// close the modal
			var myModalEl = document.getElementById('signinmodal');
			var modal = bootstrap.Modal.getInstance(myModalEl)
			modal.hide();

			// Signed in 
			//const user = userCredential.user;
			const uid = userCredential.uid;
			console.log("SignIn by function");
			//window.location = 'places.html';
			// ...
			if (type === '0') {
				//saveTask(email,password);
			}
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
		});
}

// SIGNOUT
export const signOutFunction = () => {
	signOut(auth).then(() => {
		// Sign-out successful.
		console.log('Sign-out function successful.');
	}).catch((error) => {
		// An error happened.
		console.log('Sign-out function error happened.');
	});
}

export const productList = () => getDocs(collection(db, 'products')) //console.log("Pruduct List") //

///const productsRef = collection(db, 'products')
///const queryRef = query(productsRef, where("owner", "==", "marc@gmail.com"));
//export const onGetProducts = (callback) => onSnapshot(collection(db, 'products'), callback)
///export const onGetProducts = (callback) => onSnapshot(queryRef, callback)

export const onGetProducts = (callback) => {
	//const user = auth.currentUser;
	//console.log(user.email);
	const productsRef = collection(db, 'products')
	const queryRef = query(productsRef, where("owner", "==", auth.currentUser.email));
	onSnapshot(queryRef, callback)
}

//export const onGetPlaces = (callback) => onSnapshot(collection(db, 'places'), callback)


export const onGetPromos = (id, callback) => {
	//var myFact = "GeeksforGeeks Is Awesome, " + id;
	//console.log(myFact);
	//callback(myFact);
	onSnapshot(collection(db, 'places', id, 'promotion'), callback)
}



export const getPromo = (placeId, promoId) => getDoc(doc(db, 'places', placeId, 'promotion', promoId));

export const getProduct = (id) => getDoc(doc(db, 'products', id));

export const updateProduct = (id, newFields) => updateDoc(doc(db, 'products', id), newFields);

//export const updatePlace = (id, newFields) => updateDoc(doc(db, 'places', id), newFields);


export const updatePromo = (placeId, promoId, newFields) => {
	//console.log(newFields.address)
	updateDoc(doc(db, 'places', placeId, 'promotion', promoId), newFields)
}

export const deleteProduct = (id) => deleteDoc(doc(db, 'products', id));

export const deletePromo = (placeId, promoId)  => deleteDoc(doc(db, 'places', placeId, 'promotion', promoId)); 
 *
 **/