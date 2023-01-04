import{
	signOutUser,
    auth,
	onAuthStateChanged,
	getBanner,
    onGetPlaces,
    onGetBanners,
    onGetBannersById,
} from '../utils/firebase.js';

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("promotions");
liActive.className += " active";

const dropdownPlaces = document.querySelector('#placeslist');
const promotionsContainer = document.querySelector('#promotions-container');
var usuario = "";
var placeID = "";

window.addEventListener('DOMContentLoaded', async () => {
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;
			//readPlaceImages();
            onGetPlaces((querySnapshot) => {
				dropdownPlaces.innerHTML = "";
                dropdownPlaces.add(new Option("Seleccionar...", ""), undefined);
                querySnapshot.forEach(doc => {
                    dropdownPlaces.add(new Option(doc.data().company, doc.id), undefined);
                });           
        	});
    	}	
	});
});

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})