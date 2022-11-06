//https://www.youtube.com/watch?v=yB4LTavBWtw


import {
	signOutFunction,
	auth,
	onAuthStateChanged,
	//getPlaceId,
	getPlace,
    onGetPromos,
	getPromo,
	savePromo,
	updatePromo,
	getStorage,
    ref,
    listAll,
    getDownloadURL,
    uploadBytesResumable,
	deletePromo,
} from './firebase.js'

import { Geohash as gh } from "./geoHash.js";

const promosContainer = document.querySelector('#promos-container'); // Listado de promociones
const promoForm = document.querySelector('#promo-form');	// Formulario de entrada
const copyeditField = document.querySelector('#copyedit'); // Botón Estatus debajo Título
var showQR = document.getElementById('showqr'); // Show QR
var qrcode = document.querySelector('#qrcode');

let editStatus = false;

const storage = getStorage();


const imgUrlContainer = document.querySelector("#displayImgurl");
const imgValAdContainer = document.querySelector("#displayImagevalad");
const iconContainer = document.querySelector("#displayicon");
const iconPresentContainer = document.querySelector("#displayiconpresent");
const iconMidPresentContainer = document.querySelector("#displayiconmidpresent");

// DOM ELEMENTS
const dropdownIcon = document.getElementById('icon');
const dropdownIconPresent = document.getElementById('iconpresent');
const dropdownIconMidPresent = document.getElementById('iconmidpresent');

/*
var imgurl = document.getElementById("imgurl"),
displayImgurl = document.getElementById("displayImgurl");

imgurl.addEventListener("change", function() {
	changeImage(this);
  });


const image_input = document.querySelector("#imageurl");
image_input.addEventListener("change", function () {
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		const uploaded_image = reader.result;
		document.querySelector("#displayImgurl").style.backgroundImage = `url(${uploaded_image})`;
	});
	reader.readAsDataURL(this.files[0]);
});
*/
const listbox = document.querySelector('#imageurl');
var placeId = "";
window.addEventListener('DOMContentLoaded', async () => {
	readPlaceImages();

	placeId = localStorage.getItem("placeID")
	copyeditField.innerHTML = `<button type="button" class="btn btn-secondary">Added</button>`;
	copyeditField.innerHTML += `   ( ` + placeId +` )`; 
	//https://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chl=addP%3EvD6ckBw9K0byG7tO7tHl%3E


	function formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [day, month, year].join('-');
	}

    //const promoId = document.querySelector('#promo-id').value;
	//const querySnapshot = await productList();
	//console.log(querySnapshot)
	onAuthStateChanged(auth, (user) => {

		if (user != null) {
			//onGetPromos(getPlaceId(placeId), (querySnapshot) =>{
			onGetPromos(placeId, (querySnapshot) =>{
				promosContainer.innerHTML = "";
				promosContainer.innerHTML += `<button class="btn" onclick="history.back()"> << Go Back</button>`;
				querySnapshot.forEach(doc => {
					const promoName = doc.data();
					promosContainer.innerHTML +=`
					<div class="card card-body mt-2 border-primary">
						<div class="row">
							<div class="col"><h3 class="h5">${promoName.company}</h3></div>
							<div class="col">
								<button class="btn-delete btn btn-outline-danger btn-sm float-end" data-id="${doc.id}">X</button>
							</div>
						</div>
						<h7>${promoName.name}</h3>

						<p>${promoName.description}</p>
						<div>
							<!-- button class="btn-delete btn btn-danger" data-id="${doc.id}">Delete</button -->
							<button class="btn-edit btn btn-primary" data-id="${doc.id}">Edit</button>
							<button class="btn-copy btn btn-secondary float-end" data-id="${doc.id}">Copy Promo</button>
						</div>
					</div>`;
				});

				// EDIT
				const tags = []
				const btnsEdit = promosContainer.querySelectorAll('.btn-edit')
				btnsEdit.forEach((btn) => {
					btn.addEventListener('click', async({ target: { dataset } }) => {
						
						imgUrlContainer.innerHTML = ``;
						imgValAdContainer.innerHTML = ``;

						copyeditField.innerHTML = `<button type="button" class="btn btn-primary text-white">Edit</button>`;
						//placeId.innerHTML = ``
						//console.log(placeId,dataset.id)
						const doc = await getPromo(placeId, dataset.id)
						const promo = doc.data()

						promoForm['id'] = dataset.id
						promoForm['isdemo'].checked = promo.isDemo
						promoForm['name'].value = promo.name
						promoForm['description'].value = promo.description
						promoForm['order'].value = Number(promo.order)
						const tags = promoForm['tags']
						for (const option of tags){
							const value = option.value
  							if (promo.tags.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}

						promoForm['bgcolor'].value = promo.bgColor
						promoForm['textcolor'].value = promo.textColor
						promoForm['titlecolor'].value = promo.titleColor
						promoForm['imageurl'].value = promo.imageUrl
						promoForm['imagevalad'].value = promo.imageValAd

						
						for (const option of dropdownIcon){
							const value = option.value
  							if (promo.icon.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						for (const option of dropdownIconPresent){
							const value = option.value
  							if (promo.iconpresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						for (const option of dropdownIconMidPresent){
							const value = option.value
  							if (promo.iconmidpresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						
						//promoForm['iconmidpresent'].value = promo.iconMidPresent
						//promoForm['iconpresent'].value = promo.iconPresent
						promoForm['numberOfValidations'].value = Number(promo.numberOfValidations)
						promoForm['maxvalxday'].value = Number(promo.maxValxDay)
						promoForm['midPresentAt'].value = Number(promo.midPresentAt)
						promoForm['expires'].checked = promo.expires
						promoForm['enddate'].value = formatDate(promo.endDate.toDate())
						promoForm['dias'].value = Number(promo.ndop)
						promoForm['readd'].checked = promo.reAdd
						promoForm['multivalidation'].checked = promo.multiValidation
						promoForm['sharedcode'].value = promo.sharedCode
						promoForm['startwith'].value = Number(promo.startWith);
						promoForm['idsorteo'].value = promo.lotteryId
						promoForm['lotteryfrequency'].value = Number(promo.lotteryFrequency)
						promoForm['conditions'].value = promo.conditions
						promoForm['cards'].value = promo.cards
						//console.log(promo)
						editStatus = true;
						promoForm['btn-promo-save'].innerText = "UPDATE";
						displayImg(promo.imageUrl);
						displayImgValAd(promo.imageValAd);
						displayIcon(promo.icon,1);
						displayIcon(promo.iconPresent,2);
						displayIcon(promo.iconMidPresent,3);

						var qrstr = `<div class="section h5 p-4">Añadir promoción en Cupotix escaneando el siguiente QR:</div>`;
						qrstr += `<img src="`;
						qrstr += `https://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chl=addP%3E${placeId}%3E`;
						qrstr +=  `${dataset.id}`;				
						qrstr +=  `">`;

						//console.log("PlaceId: " + placeId + " PromoId: " + dataset.id);
						qrcode.innerHTML = qrstr;
					});
				}); 

				// COPY
				const btnsCopy = promosContainer.querySelectorAll('.btn-copy')
				btnsCopy.forEach((btn) => {
					btn.addEventListener('click', async({ target: { dataset } }) => {
						imgUrlContainer.innerHTML = ``;
						imgValAdContainer.innerHTML = ``;
						copyeditField.innerHTML = `<button type="button" class="btn btn-warning text-white">Copied</button>`;
						//placeId.innerHTML = ``
						//console.log(placeId,dataset.id)
						const doc = await getPromo(placeId, dataset.id)
						const promo = doc.data()
						//promoForm['id'] = dataset.id
						promoForm['isdemo'].checked = promo.isDemo
						promoForm['name'].value = promo.name
						promoForm['description'].value = promo.description
						promoForm['order'].value = Number(promo.order)
						
						const tags = promoForm['tags']
						for (const option of tags){
							const value = option.value
  							if (promo.tags.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						promoForm['bgcolor'].value = promo.bgColor
						promoForm['textcolor'].value = promo.textColor
						promoForm['titlecolor'].value = promo.titleColor
						promoForm['imageurl'].value = promo.imageUrl
						promoForm['imagevalad'].value = promo.imageValAd
						
						for (const option of dropdownIcon){
							const value = option.value
  							if (promo.icon.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						for (const option of dropdownIconPresent){
							const value = option.value
  							if (promo.iconpresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						for (const option of dropdownIconMidPresent){
							const value = option.value
  							if (promo.iconmidpresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
  							else { option.removeAttribute('selected');}
						}
						//promoForm['iconmidpresent'].value = promo.iconMidPresent
						//promoForm['iconpresent'].value = promo.iconPresent
						promoForm['numberOfValidations'].value = Number(promo.numberOfValidations)
						promoForm['maxvalxday'].value = Number(promo.maxValxDay)
						promoForm['midPresentAt'].value = Number(promo.midPresentAt)
						promoForm['expires'].checked = promo.expires
						promoForm['enddate'].value = formatDate(promo.endDate.toDate())
						promoForm['dias'].value = Number(promo.ndop)
						promoForm['readd'].checked = promo.reAdd
						promoForm['multivalidation'].checked = promo.multiValidation
						promoForm['sharedcode'].value = promo.sharedCode
						promoForm['startwith'].value = Number(promo.startWith)
						promoForm['idsorteo'].value = promo.lotteryId
						promoForm['lotteryfrequency'].value = Number(promo.lotteryFrequency)
						promoForm['conditions'].value = promo.conditions
						promoForm['cards'].value = promo.cards
						//console.log(promo)
						editStatus = false;
						promoForm['btn-promo-save'].innerText = "ADD";
						displayImg(promo.imageUrl);
						displayImgValAd(promo.imageValAd);
						displayIcon(promo.icon,1);
						displayIcon(promo.iconPresent,2);
						displayIcon(promo.iconMidPresent,3);
					});
				});

				// DELETE
				const btnsDelete = promosContainer.querySelectorAll('.btn-delete')
				btnsDelete.forEach((btn) => {
					btn.addEventListener('click', async({ target: { dataset } }) => {
						console.log(placeId,dataset.id)
						var userPreference;
						if (confirm("¿Seguro que quiere borrar la promoción?") == true) {
							userPreference = "Promo Borrada!";
							const doc = await deletePromo(placeId, dataset.id)
						} else {
							userPreference = "Borrar Cancelado!";
						}
						console.log(userPreference);
						//alert('Seguro que quiere borrar la promo? ' + placeId + '-' + dataset.id + '-');
						//placeId.innerHTML = ``
						//console.log(placeId,dataset.id)
						//const doc = await getPromo(placeId, dataset.id)
					});
				})
			})	
				
		} else {

			let html2 = "";
			html2 += 'Login to see values';
			promosContainer.innerHTML = html2;

		}

	});

});

promoForm.addEventListener('submit', async(e) => {
	e.preventDefault();
	//console.log(localStorage.getItem("placeID"));
	const placeId = localStorage.getItem("placeID");
	const doc = await getPlace(placeId);
	const place = doc.data();
	
	const tags = document.querySelector('#tags');
	//const icon = document.querySelector('#icon');	
	
	//const fields = {};
	const fields = {
		company: place.company,
		editor: place.editor ?? "",
		location: place.address,
		placeId: placeId,
		point: place.point,	
	}
	//fields.test = "jj"
	//fields['editor'] ="Marc"
	//console.log(fields.company, fields.editor, fields.test);

	const mtags = []
	for (const option of tags){
		const value = option.value
		if(option.selected){
			mtags.push(value)
		}
	}

	for (const option of dropdownIcon){
		const value = option.value
		if(option.selected){
			if(value != "" || value != null){
				fields.icon  = value
			}
		}
	}	

	for (const option of dropdownIconPresent){
		const value = option.value
		if(option.selected){
			if(value != "" || value != null){
				fields.iconPresent  = value
			} 
		}
	}

	for (const option of dropdownIconMidPresent){
		const value = option.value
		if(option.selected){
			if(value != "" || value != null){
				fields.iconMidPresent  = value
			}
		}
	}

	var myDate = promoForm['enddate'].value
	//const myDate = document.querySelector('#enddate');
	//console.log(myDate)
	myDate = myDate.split("-");
	var newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
	//console.log(newDate.getTime());

	fields.isDemo = promoForm['isdemo'].checked
	fields.name = promoForm['name'].value
	fields.description = promoForm['description'].value
	fields.order = Number(promoForm['order'].value)
	fields.tags = mtags
	fields.bgColor = promoForm['bgcolor'].value
	fields.textColor = promoForm['textcolor'].value
	fields.titleColor = promoForm['titlecolor'].value
	fields.imageUrl = promoForm['imageurl'].value
	fields.imageValAd = promoForm['imagevalad'].value
	//fields.icon = icon
	//fields.iconMidPresent = promoForm['iconmidpresent'].value
	//fields.iconPresent = promoForm['iconpresent'].value
	fields.numberOfValidations = Number(promoForm['numberOfValidations'].value)
	fields.maxValxDay = Number(promoForm['maxvalxday'].value)
	fields.midPresentAt = Number(promoForm['midPresentAt'].value)
	fields.expires = promoForm['expires'].checked
	fields.endDate = newDate
	fields.ndop = Number(promoForm['dias'].value)
	fields.reAdd = promoForm['readd'].checked
	fields.multiValidation = promoForm['multivalidation'].checked
	fields.sharedCode = promoForm['sharedcode'].value
	fields.startWith = Number(promoForm['startwith'].value)
	fields.lotteryId = promoForm['idsorteo'].value
	fields.lotteryFrequency = Number(promoForm['lotteryfrequency'].value)
	fields.conditions = promoForm['conditions'].value
	fields.cards = promoForm['cards'].value.split(",")

	if(editStatus){
		//console.log('updating');
		const promoId = promoForm['id'];
		//console.log(id);
		//updatePromo(placeId, promoId, fields);
		console.log(fields.icon, fields.iconPresent, fields.iconMidPresent)
		editStatus = false;
		promoForm['btn-promo-save'].innerText = "ADD";
	} else {
		fields.created = new Date();
		console.log(fields.icon, fields.iconPresent, fields.iconMidPresent)
		//savePromo(placeId,fields);
	}
	iconContainer.innerHTML = '';
	iconPresentContainer.innerHTML = '';
	iconMidPresentContainer.innerHTML = '';
	promoForm.reset();
});


dropdownIcon.addEventListener('change', (e) => {
	e.preventDefault();
	displayIcon(dropdownIcon.options[dropdownIcon.selectedIndex].value, 1);
})

dropdownIconPresent.addEventListener('change', (e) => {
	e.preventDefault();
	displayIcon(dropdownIconPresent.options[dropdownIconPresent.selectedIndex].value, 2);
})

dropdownIconMidPresent.addEventListener('change', (e) => {
	e.preventDefault();
	displayIcon(dropdownIconMidPresent.options[dropdownIconMidPresent.selectedIndex].value, 3);
})

const btnsClear = document.querySelector('#btn-promo-reset')
btnsClear.addEventListener('click', (e) => {
	e.preventDefault();

	copyeditField.innerHTML = ``;
	imgUrlContainer.innerHTML = ``;
	imgValAdContainer.innerHTML = ``;
	qrcode.innerHTML = ``;

	editStatus = false;
	promoForm['btn-promo-save'].innerText = "ADD";
	promoForm.reset();
	for (const option of promoForm['tags']){
			option.removeAttribute('selected');
	}

	for (const option of dropdownIcon){
		option.removeAttribute('selected');
	}
	iconContainer.innerHTML = '';
	for (const option of dropdownIconPresent){
		option.removeAttribute('selected');
	}
	iconPresentContainer.innerHTML = '';
	for (const option of dropdownIconMidPresent){
		option.removeAttribute('selected');
	}
	iconMidPresentContainer.innerHTML = '';
})

function readPlaceImages() {
	const a = "adminWeb/" + localStorage.getItem("placeID") + "//"
	console.log(a);
	const listRef = ref(storage, a);
	
	listAll(listRef).then((res)=>{
		console.log(res)
		res.items.forEach((itemRef, index) => {
			listbox.add(new Option(itemRef.name, itemRef.name), undefined);
		})
	});
	//var option = new Option("im", "sel");
	//listbox.add(option, undefined);
	listbox.add(new Option("im2", "sel2"), undefined);
}

function populateSelect(target, value){
    if (!target){
        return false;
    }
    else {
        select = document.getElementById(target);
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        select.appendChild(opt);
    }
}

function displayImg(img){
	imgUrlContainer.innerHTML = '';
	const imgRef = ref(storage, img);
	//console.log(imgRef);
	getDownloadURL(imgRef).then((url) => {
                    //console.log(url);
                    imgUrlContainer.innerHTML += `<img class="img-responsive img-thumbnail" src="${url}">`;
    });
}

function displayImgValAd(img){
	imgValAdContainer.innerHTML = ``;
	const imgRef = ref(storage, 'ads/'+img);
	//console.log(imgRef);
	getDownloadURL(imgRef).then((url) => {
                    //console.log(url);
                    imgValAdContainer.innerHTML += `<img class="img-responsive img-thumbnail" src="${url}">`;
    });
}

function displayIcon(img, type){
	var htmlCode = '';
	const imgRef1 = ref(storage, 'icons/'+img+'01.png');
	const imgRef2 = ref(storage, 'icons/'+img+'02.png');
	
	getDownloadURL(imgRef2).then((url) => {
		htmlCode += `<div class="col">`;
		htmlCode += `<img class="img-responsive img-thumbnail float-start ms-4" width="50" height="50" src="${url}">`;
		htmlCode += `</div>`
		if (type === 1) {iconContainer.innerHTML = htmlCode;}
		if (type === 2) {iconPresentContainer.innerHTML = htmlCode;}
		if (type === 3) {iconMidPresentContainer.innerHTML = htmlCode;}
    });
	getDownloadURL(imgRef1).then((url) => {
		htmlCode += `<div class="col">`;
		htmlCode += `<img class="img-responsive img-thumbnail float-end me-5" width="50" height="50" src="${url}">`;
		htmlCode += `</div>`
		if (type === 1) iconContainer.innerHTML = htmlCode;
		if (type === 2) iconPresentContainer.innerHTML = htmlCode;
		if (type === 3) iconMidPresentContainer.innerHTML = htmlCode;
	});
}

function changeImage(input) {
	var reader;
  
	if (input.files && input.files[0]) {
	  reader = new FileReader();
  
	  reader.onload = function(e) {
		preview.setAttribute('src', e.target.result);
	  }
  
	  reader.readAsDataURL(input.files[0]);
	}
  }

