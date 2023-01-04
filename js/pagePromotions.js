import {
	//signOutFunction,
	signOutUser,
	auth,
	onAuthStateChanged,
	//getPlaceId,
    onGetPlaces,
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
} from '../utils/firebase.js'

import { Geohash as gh } from "../utils/geoHash.js";

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("promotions");
liActive.className += " active";

const promosContainer = document.querySelector('#promos-container'); // Listado de promociones
const promoForm = document.querySelector('#promo-form');	// Formulario de entrada
//const promoFormId = document.querySelector('#tres');
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
const dropdownPlaces = document.querySelector('#placeslist');
const dropdownImage = document.querySelector('#imageurl');
const dropdownImageValAd = document.querySelector('#imagevalad');
const dropdownIcon = document.querySelector('#icon');
const dropdownIconPresent = document.querySelector('#iconpresent');
const dropdownIconMidPresent = document.querySelector('#iconmidpresent');

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
var usuario = "";

window.addEventListener('DOMContentLoaded', async () => {

	//placeId = localStorage.getItem("placeID")

	copyeditField.innerHTML = `<button type="button" class="btn btn-secondary">Added</button>`;
	//copyeditField.innerHTML += `   ( ` + placeId +` )`; 
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
			usuario = auth.currentUser.uid;
            readPlaces();
			readPromoImages();
			readPromoImagesValAd();
			readPromoIcons();
			//onGetPromos(getPlaceId(placeId), (querySnapshot) =>{

				
		} else {

			let html2 = "";
			html2 += 'Login to see values';
			promosContainer.innerHTML = html2;

		}

	});

});

dropdownPlaces.addEventListener('change', (e) => {
	e.preventDefault();
    promosContainer.innerHTML = '';
    placeId = dropdownPlaces.options[dropdownPlaces.selectedIndex].value;
    if (placeId != "") {
		document.getElementById("tres").className = "container"
		readPromos();
    } else {
		document.getElementById("tres").className = "container d-none"
	}
});

promoForm.addEventListener('submit', async(e) => {
	e.preventDefault();
	//console.log(localStorage.getItem("placeID"));
	//const placeId = localStorage.getItem("placeID");
	const doc = await getPlace(placeId);
	const place = doc.data();
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
	const tags = document.querySelector('#tags');
	for (const option of tags){
		const value = option.value
		if(option.selected){
			mtags.push(value)
		}
	}
/*
	const masks = []
	const valid = Number(promoForm['numberOfValidations'].value) + 1;
	for (let i = 0; i < valid; i++) {
		masks.push("");
	}
	fields.mask = masks;
*/
	fields.imageUrl = "";
	for (const option of dropdownImage){
		const value = option.value
		if(option.selected){
			if(value != "1"){
				fields.imageUrl = value
			}
		}
	}

	fields.imageValAd = "";
	for (const option of dropdownImageValAd){
		const value = option.value
		if(option.selected){
			if(value != "1"){
				fields.imageValAd  = value
			}
		}
	}

	fields.icon = "";
	for (const option of dropdownIcon){
		const value = option.value
		if(option.selected){
			if(value != "1"){
				fields.icon  = value
			}
		}
	}	

	fields.iconPresent = "";
	for (const option of dropdownIconPresent){
		const value = option.value
		if(option.selected){
			if(value != "1"){
				fields.iconPresent  = value
			} 
		}
	}

	fields.iconMidPresent = "";
	for (const option of dropdownIconMidPresent){
		const value = option.value
		if(option.selected){
			if(value != "1"){
				fields.iconMidPresent  = value
			}
		}
	}

	var newDate;
	var myDate = promoForm['enddate'].value
	if (!myDate){
		newDate = new Date();
	}else{
		myDate = myDate.split("-");
		newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
	}
	//var myDate = formatDate(promoForm['enddate'].value);
	//const myDate = document.querySelector('#enddate');
	//console.log(myDate)
	
	//console.log(newDate.getTime());

	var lotteryId;
	//var myLottery = promoForm['idsorteo'].value;
	if (!promoForm['idsorteo'].value){
		lotteryId = null;
	} else {
		lotteryId = promoForm['idsorteo'].value;
	}

	fields.isDemo = promoForm['isdemo'].checked
	fields.name = promoForm['name'].value
	fields.description = promoForm['description'].value
	fields.order = Number(promoForm['order'].value) ?? 0
	fields.tags = mtags
	fields.bgColor = promoForm['bgcolor'].value
	fields.textColor = promoForm['textcolor'].value
	fields.titleColor = promoForm['titlecolor'].value
	fields.numberOfValidations = Number(promoForm['numberOfValidations'].value) ?? 5
	fields.maxValxDay = Number(promoForm['maxvalxday'].value) ?? 0
	fields.midPresentAt = Number(promoForm['midPresentAt'].value) ?? 0
	fields.expires = promoForm['expires'].checked
	fields.endDate = newDate ?? new Date(),
	fields.ndop = Number(promoForm['dias'].value) ?? 0
	fields.reAdd = promoForm['readd'].checked
	fields.multiValidation = promoForm['multivalidation'].checked
	fields.sharedCode = (promoForm['sharedcode'].value) ? promoForm['sharedcode'].value : null
	fields.startWith = Number(promoForm['startwith'].value) ?? 0
	fields.lotteryId = lotteryId // promoForm['idsorteo'].value ?? null
	fields.lotteryFrequency = Number(promoForm['lotteryfrequency'].value) ?? 0
	fields.conditions = promoForm['conditions'].value
	fields.cards = promoForm['cards'].value.split(",")

	if(editStatus){
		//console.log('updating');
		const promoId = promoForm['id'];
		//console.log(id);
		updatePromo(placeId, promoId, fields);
		console.log(fields.icon, fields.iconPresent, fields.iconMidPresent)
		editStatus = false;
		promoForm['btn-promo-save'].innerText = "ADD";
	} else {
		fields.created = new Date();
		fields.endDate = newDate;
		//console.log(fields.icon, fields.iconPresent, fields.iconMidPresent)
		savePromo(placeId,fields);
	}
	imgUrlContainer.innerHTML = '';
	imgValAdContainer.innerHTML = '';
	iconContainer.innerHTML = '';
	iconPresentContainer.innerHTML = '';
	iconMidPresentContainer.innerHTML = '';
	promoForm.reset();
});

dropdownImage.addEventListener('change', (e) => {
	e.preventDefault();
	if (dropdownImage.options[dropdownImage.selectedIndex].value != "1"){
		displayImg(dropdownImage.options[dropdownImage.selectedIndex].value, 1);
	} else {
		imgUrlContainer.innerHTML = ``;
	}
	
})

dropdownImageValAd.addEventListener('change', (e) => {
	e.preventDefault();
	if (dropdownImageValAd.options[dropdownImageValAd.selectedIndex].value != "1"){
		displayImgValAd(dropdownImageValAd.options[dropdownImageValAd.selectedIndex].value, 1);
	} else {
		imgValAdContainer.innerHTML = ``;
	}
})

dropdownIcon.addEventListener('change', (e) => {
	e.preventDefault();
	if (dropdownIcon.options[dropdownIcon.selectedIndex].value != "1"){
		displayIcon(dropdownIcon.options[dropdownIcon.selectedIndex].value, 1);
	} else {
		iconContainer.innerHTML = ``;
	}
})

dropdownIconPresent.addEventListener('change', (e) => {
	e.preventDefault();
	if (dropdownIconPresent.options[dropdownIconPresent.selectedIndex].value != "1"){
		displayIcon(dropdownIconPresent.options[dropdownIconPresent.selectedIndex].value, 2);
	} else {
		iconPresentContainer.innerHTML = ``;
	}
})

dropdownIconMidPresent.addEventListener('change', (e) => {
	e.preventDefault();
	if (dropdownIconMidPresent.options[dropdownIconMidPresent.selectedIndex].value != "1"){
		displayIcon(dropdownIconMidPresent.options[dropdownIconMidPresent.selectedIndex].value, 3);
	} else {
		iconMidPresentContainer.innerHTML = ``;
	}
})

const btnsClear = document.querySelector('#btn-promo-reset')
btnsClear.addEventListener('click', (e) => {
	e.preventDefault();

	copyeditField.innerHTML = ``;
	imgUrlContainer.innerHTML = ``;
	imgValAdContainer.innerHTML = ``;
	iconContainer.innerHTML = ``;
	iconPresentContainer.innerHTML = ``;
	iconMidPresentContainer.innerHTML = '';
	qrcode.innerHTML = ``;

	editStatus = false;
	promoForm['btn-promo-save'].innerText = "ADD";
	promoForm.reset();
	for (const option of promoForm['tags']){
			option.removeAttribute('selected');
	}
	for (const option of dropdownImage){
		option.removeAttribute('selected');
	}
	for (const option of dropdownImageValAd){
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
	
})

function readPlaces(){
    onGetPlaces((querySnapshot) => {
        dropdownPlaces.innerHTML = "";
        dropdownPlaces.add(new Option("Seleccionar...", ""), undefined);
        querySnapshot.forEach(doc => {
            dropdownPlaces.add(new Option(doc.data().company, doc.id), undefined);
        });           
    });
}

function readPromos(){
	copyeditField.innerHTML = `   ( PlaceId: ` + placeId +` )`; 
	if (placeId != "") {
		    onGetPromos(placeId, (querySnapshot) =>{
        promosContainer.innerHTML = "";
        //promosContainer.innerHTML += `<button class="btn" onclick="history.back()"> << Go Back</button>`;
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
                btnsClear.click();
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

                for (const option of dropdownImage){
                    const value = option.value
                      if (promo.imageUrl.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownImageValAd){
                    const value = option.value
                      if (promo.imageValAd.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                
                for (const option of dropdownIcon){
                    const value = option.value
                      if (promo.icon.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownIconPresent){
                    const value = option.value
                      if (promo.iconPresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownIconMidPresent){
                    const value = option.value
                      if (promo.iconMidPresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
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
                
				(promo.imageUrl != "") ? displayImg(promo.imageUrl) : null;
				(promo.imageValAd != "" ) ? displayImgValAd(promo.imageValAd) : null;
                (promo.icon != "") ? displayIcon(promo.icon,1) : null;
				(promo.iconPresent != "") ? displayIcon(promo.iconPresent,2) : null;
				(promo.iconMidPresent != "") ? displayIcon(promo.iconMidPresent,3) : null;

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
				btnsClear.click();
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

                for (const option of dropdownImage){
                    const value = option.value
                      if (promo.imageUrl.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownImageValAd){
                    const value = option.value
                      if (promo.imageValAd.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownIcon){
                    const value = option.value
                      if (promo.icon.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownIconPresent){
                    const value = option.value
                      if (promo.iconPresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
                      else { option.removeAttribute('selected');}
                }
                for (const option of dropdownIconMidPresent){
                    const value = option.value
                      if (promo.iconMidPresent.indexOf(value) !== -1) {option.setAttribute('selected', 'selected');}
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
                
				//console.log(promo.imageUrl, promo.imageValAd, promo.icon, promo.iconPresent, promo.iconMidPresent);

				(promo.imageUrl != "") ? displayImg(promo.imageUrl) : null;
				(promo.imageValAd != "" ) ? displayImgValAd(promo.imageValAd) : null;
                (promo.icon != "") ? displayIcon(promo.icon,1) : null;
				(promo.iconPresent != "") ? displayIcon(promo.iconPresent,2) : null;
				(promo.iconMidPresent != "") ? displayIcon(promo.iconMidPresent,3) : null;

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
	}

}

function readPromoImages() {
	var path = usuario + "/promotions/";
	const listRef = ref(storage, path);
	dropdownImage.add(new Option("Seleccionar...", "1"), undefined);
	listAll(listRef).then((res)=>{
		//console.log(res)
		res.items.forEach((itemRef, index) => {
			dropdownImage.add(new Option(itemRef.name, path + itemRef.name), undefined);
		})
	});
}

function readPromoImagesValAd() {
	var path = usuario + "/ads/";
	const listRef = ref(storage, path);
	dropdownImageValAd.add(new Option("Seleccionar...", "1"), undefined);
	listAll(listRef).then((res)=>{
		//console.log(res)
		res.items.forEach((itemRef, index) => {
			dropdownImageValAd.add(new Option(itemRef.name, path + itemRef.name), undefined);
		})
	});
}

function readPromoIcons() {
	var path = usuario + "/icons/";
	const listRef = ref(storage, path);
	dropdownIcon.add(new Option("Seleccionar...", "1"), undefined);
	dropdownIconMidPresent.add(new Option("Seleccionar...", "1"), undefined);
	dropdownIconPresent.add(new Option("Seleccionar...", "1"), undefined);
	listAll(listRef).then((res)=>{
		//console.log(res)
		res.items.forEach((itemRef, index) => {
			//let position = itemRef.name.search("01.");
			//if (position != -1){
				dropdownIcon.add(new Option(itemRef.name, path + itemRef.name), undefined);
				dropdownIconMidPresent.add(new Option(itemRef.name, path + itemRef.name), undefined);
				dropdownIconPresent.add(new Option(itemRef.name, path + itemRef.name), undefined);
			//}
		})
	});
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
	const imgRef = ref(storage, img);
	//console.log(imgRef);
	getDownloadURL(imgRef).then((url) => {
                    //console.log(url);
                    imgValAdContainer.innerHTML += `<img class="img-responsive img-thumbnail" src="${url}">`;
    });
}

function displayIcon(img, type){
	var htmlCode = '';
	var img1 = img.replace("02.", "01.");;

	const imgRef1 = ref(storage, img1);
	const imgRef2 = ref(storage, img);
	
	getDownloadURL(imgRef2).then((url) => {
		htmlCode += `<div class="col">`;
		//htmlCode += `<img class="img-responsive img-thumbnail float-start ms-4" width="50" height="50" src="${url}">`;
		htmlCode += `<img class="img-responsive img-thumbnail float-center" width="50" height="50" src="${url}">`;
		htmlCode += `</div>`
		if (type === 1) {iconContainer.innerHTML = htmlCode;}
		if (type === 2) {iconPresentContainer.innerHTML = htmlCode;}
		if (type === 3) {iconMidPresentContainer.innerHTML = htmlCode;}
    });
	/*
	getDownloadURL(imgRef1).then((url) => {
		htmlCode += `<div class="col">`;
		htmlCode += `<img class="img-responsive img-thumbnail float-end me-5" width="50" height="50" src="${url}">`;
		htmlCode += `</div>`
		if (type === 1) iconContainer.innerHTML = htmlCode;
		if (type === 2) iconPresentContainer.innerHTML = htmlCode;
		if (type === 3) iconMidPresentContainer.innerHTML = htmlCode;
	});
	*/
}

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})