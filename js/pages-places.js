import{
	auth,
	onAuthStateChanged,
	signOutUser,
	onGetPlaces,
	getPlaceId,
	getPlace,
	savePlace,
	updatePlace,
	deletePlace,
	getStorage,
	ref,
	listAll,
	getDownloadURL,
	GeoPoint,
} from '../utils/firebase.js';

import { Geohash as gh } from "../utils/geoHash.js";

const storage = getStorage();

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("places");
liActive.className += " active";

const placesContainer = document.querySelector('#places-container');
//const promosContainer = document.querySelector('#promos-container');

const placeForm = document.querySelector('#place-form');
const placeId = document.querySelector('#placeId');

// IMAGE
const dropdownImage = document.querySelector('#imageurl');
const imgUrlContainer = document.getElementById('displayImgUrl');
let imageUrl = '';

var usuario = "";

let id = '';
let editStatus = false;


logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})

window.addEventListener('DOMContentLoaded', async () => {
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;
			readPlaceImages();
			onGetPlaces((querySnapshot) => {
				placesContainer.innerHTML = "";
				//placesContainer.innerHTML += `<button class="btn" onclick="history.back()"> << Go Back</button>`;
				querySnapshot.forEach(doc => {
					//console.log(doc.id, doc.data().name);
					const place = doc.data()

					placesContainer.innerHTML += `
					<div class="card card-body mt-2 border-primaary">
						<div class="row">
                    		<div class="col"><h3 class="h5">${place.company}</h3></div>
                    		<div class="col">
                        		<button class="btn-delete btn btn-outline-danger btn-sm float-end" data-id="${doc.id}">X</button>
                    		</div>
                		</div>
						<h3 class="h5">${place.name}</h3>
						<p>${doc.id}</p>
						<div>
							<!-- button class="btn-delete btn btn-danger" data-id="${doc.id}">Delete</button -->
							<button class="btn-edit btn btn-primary" data-id="${doc.id}">Editar</button>
							<!-- button class="btn-go-promos btn btn-secondary float-end" data-id="${doc.id}">Ver Promociones</button -->
						</div>
					</div>
				`;

				})

				///placesContainer.innerHTML = html;

        		// DELETE
        		const btnsDelete = placesContainer.querySelectorAll('.btn-delete')
        		btnsDelete.forEach((btn) => {
            		btn.addEventListener('click', async({ target: { dataset } }) => {
                		console.log(dataset.id)
                		var userPreference;
                		if (confirm("¿Seguro que quiere borrar el Comercio?") == true) {
                    		userPreference = "Comercio Borrado!";
							btnsClear.click();
                    		// const doc = await deletePlace(dataset.id); // Desactivado por peligroso
                		} else {
                    		userPreference = "Borrar Cancelado!";
                		}
                		console.log(userPreference);
            		});
        		})

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

						//console.log("Data DB: " + place.imageUrl);
						imageUrl = place.imageUrl;

						// Rellenamos dropdown Image con placeId
						//dropdownImage.add(new Option(dataset.id, "places/" + dataset.id + ".jpg"), undefined);

						//for (const option of dropdownImage){
						for (const option of placeForm['imageurl']){
							const value = option.value
							//console.log("Value: "+ value);
							//console.log("place.imageUrl: " + place.imageUrl);
							//console.log("indexOf: " + place.imageUrl.indexOf(value));
							if (!value){
								option.removeAttribute('selected');
							}else {
								//console.log("Value: "+ value);
								//console.log("dropdownImage: " + dropdownImage);
								//console.log("placeForm['imageurl']: " + placeForm['imageurl']);
								//console.log("imageurl: " + imageUrl);
								if (place.imageUrl.indexOf(value) !== -1) {
									//console.log("indexOf:" + place.imageUrl.indexOf(value));
									option.setAttribute('selected', 'selected');
									displayImg(place.imageUrl);
								} else { 
									option.removeAttribute('selected');
								}
							}
						}

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

	const fields = {
		isDemo: switchButton.checked,
		company: company,
		name: name,
		address: address,
		phone: phone,
		point: { "geohash": gh.encode(lat, lon), "geopoint": new GeoPoint(lat, lon) },
	}

	for (const option of dropdownImage){
		const value = option.value
		if(option.selected){
			if(value != "" || value != null){
				fields.imageUrl  = value
			}
		}
	}	

	const tags = document.querySelector('#tags');
	const mtags = []
	for (const option of tags){
		const value = option.value
		if(option.selected){
			mtags.push(value)
		}
	}
	fields.tags = mtags;

	//console.log(mtags)
	//console.log(switchButton.checked);
	const isChecked = switchButton.checked

	//console.log(fields.imageUrl);

	if(editStatus){
		//console.log('updating');
		//console.log(id)
		updatePlace(id, fields);
		editStatus = false;
		placeForm['btn-place-save'].innerText = "AÑADIR";
		alert('Datos comercio modificados');
		btnsClear.click();
		
	} else {
		savePlace(fields);
		alert('Datos comercio creados');
		btnsClear.click();
	}
/*	
	placeForm.reset(); // ponemos los campos a blanco
	for (const option of placeForm['tags']){
		option.removeAttribute('selected');
	}
*/
});

// RESET

//const btnsClear = placeForm('btn-place-reset')
const btnsClear = document.querySelector('#btn-place-reset')
btnsClear.addEventListener('click', (e) => {
	e.preventDefault();
	placeForm.reset(); // ponemos los campos a blanco
	editStatus = false;
	placeId.innerHTML = ``
	imgUrlContainer.innerHTML = '';
	placeForm['btn-place-save'].innerText = "AÑADIR";
	placeForm.reset();
	for (const option of placeForm['imageurl']){
		option.removeAttribute('selected');
	}
	for (const option of placeForm['tags']){
			option.removeAttribute('selected');
	}
	//console.log('Reset')
})

dropdownImage.addEventListener('change', (e) => {
	e.preventDefault();
	//var path =  "places/" + id + ".jpg";
	//if (dropdownImage.options[dropdownImage.selectedIndex].value != id ){
		displayImg(dropdownImage.options[dropdownImage.selectedIndex].value, 1);
	//} else {
		//displayImg(path,1);
	//}

	
})

function readPlaceImages() {
	var path = usuario + "/places/";
	//var path = "places/";

	const listRef = ref(storage, path);

	dropdownImage.add(new Option("Seleccionar...", ""), undefined);
	
	listAll(listRef).then((res)=>{
		//console.log(res)
		res.items.forEach((itemRef, index) => {
			dropdownImage.add(new Option(itemRef.name, path + itemRef.name), undefined);
		})
	});
	//var option = new Option("im", "sel");
	//listbox.add(option, undefined);
	//listbox.add(new Option("im2", "sel2"), undefined);
}

function displayImg(img){
	//var path = usuario + "/places/" + img;
	imgUrlContainer.innerHTML = '';
	const imgRef = ref(storage, img);
	//console.log(imgRef);
	getDownloadURL(imgRef).then((url) => {
        imgUrlContainer.innerHTML = `<img class="img-responsive img-thumbnail" src="${url}">`;
    });
}