import{
	signOutUser
} from './firebase.js'

var logOutButtonElement = document.getElementById('logout');

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})