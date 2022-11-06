import{
	signOutUser
} from '../utils/firebase.js';

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("sliders");
liActive.className += " active";

//window.addEventListener("DOMContentLoaded", () => {
	//liActive.className += " active";
	//loadComponentFromFile('/main/header.html', header_container);
	//loadComponentFromFile('/main/sidebar.html', sidebar_container);
//})

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})


