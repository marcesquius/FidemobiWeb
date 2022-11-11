import {
	signOutUser,
	auth,
	onAuthStateChanged,
    uploadImage,
    fullUploadImage,
    listImages,
    getStorage,
    ref,
    listAll,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from '../utils/firebase.js';

var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("images");
liActive.className += " active";


const imagesForm = document.querySelector('#images-form');
const imgListContainer = document.querySelector('#img-list');
const dropdownFolders = document.getElementById('folders');


var fichero;
var folders = "";
var imageList = Array();
var usuario = "";

const storage = getStorage();

window.addEventListener('DOMContentLoaded', async () => {
    fichero = imagesForm['fichero'];
    fichero.addEventListener('click', ()=>{
        document.getElementById("progreso").className = "";
        document.getElementById("bptexto").textContent = "Waiting ....";
    });
    fichero.addEventListener('change', subirImagenFirebase, false);
    
    onAuthStateChanged(auth, (user) =>{
        if (user != null){
            //console.log(auth.currentUser.email, auth.currentUser.uid);
            usuario = auth.currentUser.uid;
        } else {
            imgListContainer.innerHTML = `No images`;
        }
    })
});

dropdownFolders.addEventListener('change', async(e) => {
	e.preventDefault();
    folders = dropdownFolders.options[dropdownFolders.selectedIndex].value;
    console.log(folders);
	await listarImagenes(dropdownFolders.options[dropdownFolders.selectedIndex].value, 1);
})

function listarImagenes(folder){
    var path = usuario + "/" + folder + "/";
    //console.log(path);

    var listRef = ref(storage, path);

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
            var imgs = path + itemRef.name;
            console.log(imgs);
            var starsRef = ref(storage, imgs);
            // Get the download URL
            getDownloadURL(starsRef)
                .then((url) => {
                    //console.log(url);
                    imgListContainer.innerHTML += `
                    <div class="col">
                        <div class="card text-end" style="width: 25rem;">  
                            <img class="card-img-top" src="${url}">
                            <div class="card-img-overlay">
                                <!-- a href="#" class="btn btn-danger btn-delete">X</a -->
                                <button class="btn-delete btn btn-danger" data-id="${imgs}">X</button>
                            </div>
                        </div>
                    </div>
                    `;

                    var btnsDelete = imgListContainer.querySelectorAll('.btn-delete')
                    btnsDelete.forEach((btn) => {
                        btn.addEventListener('click', async({ target: { dataset } }) => {
                            console.log(dataset.id)
                            var userPreference;
                            if (confirm("¿Seguro que quiere borrar la promoción?") == true) {
                                userPreference = "Promo Borrada!";
                                const doc = await deleteImage(dataset.id)
                            } else {
                                userPreference = "Borrar Cancelado!";
                            }
                            console.log(userPreference);
                        });
                    })

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
	//const storage = getStorage();
    
	// Create the file metadata
	/** @type {any} */
	const metadata = {
		contentType: 'image/jpeg'
	};

    var path = usuario + "/" + folders + "/" + file.name;
    //console.log(path);
    //var listRef = ref(storage, path);

	// Upload file and metadata to the object 'images/mountains.jpg'
	const storageRef = ref(storage, path);
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
			//getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
			//	console.log('File available at', downloadURL);
            //    imgListContainer.innerHTML += `<img src="${downloadURL}">`;
			//});
            document.getElementById("bptexto").textContent = "";
            listarImagenes(folders);
		}
	);
}

function deleteImage(file){
    const desertRef = ref(storage, file);
    deleteObject(desertRef).then(() => {
        console.log('File deleted successfully');
        listarImagenes(folders);
    }).catch((error) => {
        console.log('Uh-oh, an error occurred!');
    });
    //listImages()
}

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})