import{
	auth,
	onAuthStateChanged,
	signOutUser,
	onGetPlaces,
	getPlaceId,
	getPlace,
	savePlace,
	updatePlace,
} from '../utils/firebase.js';

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("places");
liActive.className += " active";

const placesContainer = document.querySelector('#places-container');
//const promosContainer = document.querySelector('#promos-container');

const placeForm = document.querySelector('#place-form');
const placeId = document.querySelector('#placeId');

let id = '';
let editStatus = false;

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})

window.addEventListener('DOMContentLoaded', async () => {
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			onGetPlaces((querySnapshot) => {
				placesContainer.innerHTML = "";
				//placesContainer.innerHTML += `<button class="btn" onclick="history.back()"> << Go Back</button>`;
				querySnapshot.forEach(doc => {
					//console.log(doc.id, doc.data().name);
					const place = doc.data()

					placesContainer.innerHTML += `
					<div class="card card-body mt-2 border-primaary">
						<h3 class="h5">${place.name}</h3>
						<p>${place.company}</p>
						<p>${doc.id}</p>
						<div>
							<!-- button class="btn-delete btn btn-danger" data-id="${doc.id}">Delete</button -->
							<button class="btn-edit btn btn-primary" data-id="${doc.id}">Editar</button>
							<button class="btn-go-promos btn btn-secondary float-end" data-id="${doc.id}">Ver Promociones</button>
						</div>
					</div>
				`;

				})

				///placesContainer.innerHTML = html;

				// EDIT
				const btnsEdit = placesContainer.querySelectorAll('.btn-edit')
				const tags = []

				//console.log(btnsEdit)
				btnsEdit.forEach((btn) => {
					/* is OK
					btn.addEventListener('click', (event) => {
						console.log(event.target.dataset.id)
					})
					*/
					// Es lo mismo que el anterior target i dataset son objetos
					btn.addEventListener('click', async ({ target: { dataset } }) => {
						placeId.innerHTML = ``
						const doc = await getPlace(dataset.id)
						const place = doc.data()
						placeForm['flexSwitchCheckChecked'].checked = place.isDemo
						//placeForm['id'].value = dataset.id; // también id = doc.id
						id = doc.id;
						placeId.innerHTML += dataset.id;
						placeForm['company'].value = place.company
						placeForm['name'].value = place.name
						placeForm['address'].value = place.address
						placeForm['phone'].value = place.phone
						placeForm['lat'].value = place.point.geopoint.latitude
						placeForm['lon'].value = place.point.geopoint.longitude
						const tags = placeForm['tags']
						for (const option of tags) {
							//const value = Number.parseInt(option.value);
							const value = option.value
							/* If option value contained in values, set selected attribute */
							if (place.tags.indexOf(value) !== -1) {
								option.setAttribute('selected', 'selected');
							}
							/* Otherwise ensure no selected attribute on option */
							else {
								option.removeAttribute('selected');
							}
						}
						editStatus = true;
						placeForm['btn-place-save'].innerText = "ACTUALIZAR";
					})

				})

				// Go To Promos
				const btnsGoPromos = placesContainer.querySelectorAll('.btn-go-promos')
				//console.log(btnsDelete)
				btnsGoPromos.forEach(btn => {
					let html3 = "";
					/* is OK
					btn.addEventListener('click', (event) => {
						console.log(event.target.dataset.id)
					})
					*/
					// Es lo mismo que el anterior target i dataset son objetos
					btn.addEventListener('click', ({ target: { dataset } }) => {

						localStorage.setItem("placeID", dataset.id);

						console.log(dataset.id)
						//deleteProduct(dataset.id)
						//getPlaceId(dataset.id);

						window.location = "pages-promotions.html";

					})
				})
			})
		} else {
			let html2 = "";
			html2 += 'Login to see values';
			placesContainer.innerHTML = html2;
		}
	});
});


placeForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const switchButton = document.getElementById('flexSwitchCheckChecked');
	const company = document.querySelector('#company').value;
	const name = document.querySelector('#name').value;
	const address = document.querySelector('#address').value;
	const phone = document.querySelector('#phone').value;
	const lat = document.querySelector('#lat').value;
	const lon = document.querySelector('#lon').value;
	const tags = document.querySelector('#tags');
	const mtags = []
	for (const option of tags){
		const value = option.value
		if(option.selected){
			mtags.push(value)
		}
	}
	//console.log(mtags)
	//console.log(switchButton.checked);
	const isChecked = switchButton.checked
	if(editStatus){
		//console.log('updating');
		//console.log(id)
		updatePlace(id, {
			isChecked,
			company,
			name,
			address,
			phone, 
			lat, 
			lon, 
			mtags,
			}
		)
		editStatus = false;
		placeForm['btn-place-save'].innerText = "AÑADIR";
		alert('Datos comercio modificados');
	} else {
		savePlace(
			switchButton.checked, 
			company,
			name,
			address, 
			phone, 
			lat, 
			lon, 
			mtags,
		)
		alert('Datos comercio creados');
	}
	
	placeForm.reset(); // ponemos los campos a blanco
	for (const option of placeForm['tags']){
		option.removeAttribute('selected');
	}
});

// RESET

//const btnsClear = placeForm('btn-place-reset')
const btnsClear = document.querySelector('#btn-place-reset')
btnsClear.addEventListener('click', (e) => {
	e.preventDefault();
	editStatus = false;
	placeId.innerHTML = ``
	placeForm['btn-place-save'].innerText = "AÑADIR";
	placeForm.reset();
	for (const option of placeForm['tags']){
			option.removeAttribute('selected');
	}
	//console.log('Reset')
})

/*
import {
	signOutFunction,
	//productList,
	//statusChanged,
	auth,
	onAuthStateChanged,
	//onSnapshot,
	//collection,
	//db,
	onGetPlaces,
	deleteProduct,
    onGetPromos,
	getPlaceId,
	getPlace,
	savePlace,
	updatePlace,
} from './firebase.js'

const placesContainer = document.querySelector('#places-container');
const promosContainer = document.querySelector('#promos-container');

const placeForm = document.querySelector('#place-form');
const placeId = document.querySelector('#placeId');

let id = '';
let editStatus = false;

window.addEventListener('DOMContentLoaded', async () => {

	//const querySnapshot = await productList();
	//console.log(querySnapshot)
	onAuthStateChanged(auth, (user) => {

		if (user != null) {
			onGetPlaces((querySnapshot) => {
				placesContainer.innerHTML = "";
				placesContainer.innerHTML += `<button class="btn" onclick="history.back()"> << Go Back</button>`;
				querySnapshot.forEach(doc => {
					//console.log(doc.id, doc.data().name);
					const place = doc.data()

					placesContainer.innerHTML += `
					<div class="card card-body mt-2 border-primaary">
						<h3 class="h5">${place.company}</h3>
						<p>${place.name}</p>
						<p>${doc.id}</p>
						<div>
							<!-- button class="btn-delete btn btn-danger" data-id="${doc.id}">Delete</button -->
							<button class="btn-edit btn btn-primary" data-id="${doc.id}">Edit</button>
							<button class="btn-go-promos btn btn-secondary float-end" data-id="${doc.id}">Go Promos</button>
						</div>
					</div>
				`;

				})

				///placesContainer.innerHTML = html;

				// EDIT
				const btnsEdit = placesContainer.querySelectorAll('.btn-edit')
				const tags = []

				//console.log(btnsEdit)
				btnsEdit.forEach((btn) => {
					/* is OK
					btn.addEventListener('click', (event) => {
						console.log(event.target.dataset.id)
					})
					*/
					/*
					// Es lo mismo que el anterior target i dataset son objetos
					btn.addEventListener('click', async({ target: { dataset } }) => {
						placeId.innerHTML = ``
						const doc = await getPlace(dataset.id)
						const place = doc.data()
						placeForm['flexSwitchCheckChecked'].checked = place.isDemo
						//placeForm['id'].value = dataset.id; // también id = doc.id
						id = doc.id;
						placeId.innerHTML += dataset.id;
						placeForm['company'].value = place.company
						placeForm['address'].value = place.address
						placeForm['phone'].value = place.phone
						placeForm['lat'].value = place.point.geopoint.latitude
						placeForm['lon'].value = place.point.geopoint.longitude
						const tags = placeForm['tags']
						for (const option of tags){
							//const value = Number.parseInt(option.value);
							const value = option.value
  							/* If option value contained in values, set selected attribute */
							  /*
  							if (place.tags.indexOf(value) !== -1) {
    							option.setAttribute('selected', 'selected');
  							}
  							/* Otherwise ensure no selected attribute on option */
							  /*
  							else {
    							option.removeAttribute('selected');
  							}
						}
						editStatus = true;
						placeForm['btn-place-save'].innerText = "UPDATE";
					})

				})

				// Go To Promos
				const btnsGoPromos = placesContainer.querySelectorAll('.btn-go-promos')
				//console.log(btnsDelete)
				btnsGoPromos.forEach(btn => {
					let html3 = "";
					/* is OK
					btn.addEventListener('click', (event) => {
						console.log(event.target.dataset.id)
					})
					*/
					/*
					// Es lo mismo que el anterior target i dataset son objetos
					btn.addEventListener('click', ({ target: { dataset } }) => {

						localStorage.setItem("placeID",dataset.id);

						console.log(dataset.id)
						//deleteProduct(dataset.id)
						//getPlaceId(dataset.id);

						window.location ="placespromotions.html";
/*
						onGetPromos(getPlaceId(dataset.id), (querySnapshot) =>{
							
							querySnapshot.forEach(doc => {
								const promoName = doc.data().name;
								console.log(promoName)
								html3 += '<li class="list-group-item list-group-item-action">'
								html3 += '<h5>' + promoName + '</h5></li>';
							});
							
						})
						
						promosContainer.innerHTML = html3;
*/
/*

					})

				})

			})

		} else {

			let html2 = "";
			html2 += 'Login to see values';
			placesContainer.innerHTML = html2;

		}

	});

});



// LOGOUT
const logout = document.querySelector('#logout'); // id="logout"
logout.addEventListener('click', e => {
	e.preventDefault();
	signOutFunction();
});
*/