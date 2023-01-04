import{
	auth,
	onAuthStateChanged,
	signOutUser,
    onGetPlaces,
    onGetPromos,
    //onGetBanners,
    getUser,
    onGetUserByPromo,
    userExist,
    userPromoExist,
    addPromoToUser,
    formatDate,
} from '../utils/firebase.js';

var usuario = "";
var liActive = document.getElementById("changes");
var logOutButtonElement = document.getElementById('logout');

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
});

window.addEventListener('DOMContentLoaded', () => {
    liActive.className += " active";
    onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;
        } else {

        }
    });

});
