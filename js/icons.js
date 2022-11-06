//https://www.youtube.com/watch?v=i3WdUCvCQSU
import {
	signOutFunction,
	auth,
	onAuthStateChanged,
    uploadImage,
    fullUploadImage,
    listImages,
    getStorage,
    ref,
    listAll,
    getDownloadURL,
} from '../utils/firebase.js';

const promoForm = document.querySelector('#icons-form');
const imgListContainer = document.querySelector('#img-list');
var fichero;
var imageList = Array();


const storage = getStorage();
const listRef = ref(storage, 'demo');


window.addEventListener('DOMContentLoaded', async () => {
    fichero = promoForm['fichero'];
    fichero.addEventListener('click', ()=>{
        document.getElementById("progreso").className = "";
        document.getElementById("bptexto").textContent = "Waiting ....";
    });
    fichero.addEventListener('change', subirImagenFirebase, false);
    
    onAuthStateChanged(auth, (user) =>{
        if (user != null){
            ///imgListContainer.innerHTML = ``;
            ///const storage = getStorage();

            // Create a reference under which you want to list
            ///const listRef = ref(storage, 'demo');

            // Find all the prefixes and items.
            listarImagenes();
        } else {
            imgListContainer.innerHTML = `No images`;
        }
    })
    //uploadImage();
});

/*
function subirImagenFirebase1(){
    var fichero = document.getElementById("fichero").files[0];
    fullUploadImage(fichero);
}
*/

function listarImagenes(){
    imgListContainer.innerHTML = ``;
    listAll(listRef)
    .then((res) => {
        res.prefixes.forEach((folderRef) => {
            console.log('FOLDERS')
            console.log(folderRef)
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef, index) => {
            //console.log('ITEMS')
            //console.log(itemRef)
            //console.log(index)
            var dirr = 'demo/' + itemRef.name;
            console.log(dirr);
            var starsRef = ref(storage, dirr);
            // Get the download URL
            getDownloadURL(starsRef)
                .then((url) => {
                    console.log(url);
                    imgListContainer.innerHTML += `<img src="${url}">`;
                    // Insert url into an <img> tag to "download"
                })
            // All the items under listRef.
        });
    }).catch((error) => {
        console.log('ERROR')
        console.log(error)
        // Uh-oh, an error occurred!
    });
}

function subirImagenFirebase (){
    //document.getElementById("progreso").className = "";
    const file = document.getElementById("fichero").files[0];
	const storage = getStorage();
    
	// Create the file metadata
	/** @type {any} */
	const metadata = {
		contentType: 'image/jpeg'
	};

	// Upload file and metadata to the object 'images/mountains.jpg'
	const storageRef = ref(storage, 'demo/' + file.name);
	const uploadTask = uploadBytesResumable(storageRef, file, metadata);
	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on('state_changed',
		(snapshot) => {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
            document.getElementById("bptexto").textContent = "Complete"
            document.getElementById("barra-de-progreso").style.width = progress + "%";
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			// A full list of error codes is available at
			// https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case 'storage/unauthorized':
					// User doesn't have permission to access the object
					console.log('storage/unauthorized');
					break;
				case 'storage/canceled':
					// User canceled the upload
					console.log('storage/canceled');
					break;

				// ...

				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					console.log('storage/unknown')
					break;
			}
		},
		() => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log('File available at', downloadURL);
                imgListContainer.innerHTML += `<img src="${downloadURL}">`;
			});
		}
	);
}


/*
window.onload = inicializar;
var fichero;

function inicializar(){
    fichero = document.getElementById("fichero");
    fichero.addEventListener("change", subirImagenFirebase, false);
}

function subirImagenFirebase(){
    var imagenASubir = fichero.files[0];
}
*/