
import{
	signIn,
	initFirebaseAuth,
} from './firebase.js'

var signInButtonElement = document.getElementById('sign-in');

signInButtonElement.addEventListener('click', (e) =>{
	e.preventDefault();
	var loginEmailElement = document.getElementById('login-email').value;
	var loginPasswordElement = document.getElementById('login-password').value;
	signIn(loginEmailElement,loginPasswordElement);
});

initFirebaseAuth();

/*
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
*/