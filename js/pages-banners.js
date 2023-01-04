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
var liActive = document.getElementById("banners");


const bannerForm = document.querySelector('#banner-form');	// Formulario de entrada

const dropdownPlaces = document.querySelector('#placeslist');
const bannersContainer = document.querySelector('#banners-container');
var usuario = "";
var placeId = "";

window.addEventListener('DOMContentLoaded', async () => {
	liActive.className += " active";
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

dropdownPlaces.addEventListener('change', (e) => {
	e.preventDefault();
	bannersContainer.innerHTML = '';
    placeId = dropdownPlaces.options[dropdownPlaces.selectedIndex].value;
    if (placeId != "") {
		document.getElementById("showhide").className = "container"
		readBenners()
	} else {
		document.getElementById("showhide").className = "container d-none"
	}
})

function readBenners(){
	onGetBannersById(placeId, (querySnapshot) => {
        querySnapshot.forEach(doc => {
			const banner = doc.data()
			bannersContainer.innerHTML += `
			<div class="card card-body mt-2 border-primary">
				<h3 class="h5">${banner.name}</h3>
				<p>${banner.title}</p>
				<p>${doc.id}</p>
				<div>
					<!-- button class="btn-delete btn btn-danger" data-id="${doc.id}">Delete</button -->
					<button class="btn-edit btn btn-primary" data-id="${doc.id}">Editar</button>
					<!-- button class="btn-go-promos btn btn-secondary float-end" data-id="${doc.id}">Ver Promociones</button -->
				</div>
			</div>
		`;
           
        });
		// EDIT
		const tags = []
		const btnsEdit = bannersContainer.querySelectorAll('.btn-edit')
		btnsEdit.forEach((btn) => {
			btn.addEventListener('click', async({ target: { dataset } }) => {
				const doc = await getBanner(placeId, dataset.id)
				const banner = doc.data()
				console.log(banner);
				//bannerForm['id'].value = dataset.id
				bannerForm['title'].value = banner.title
				
			});
        });
    });
}

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})