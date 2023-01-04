import{
	auth,
	onAuthStateChanged,
	signOutUser,
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
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
var fichero;
const folders = "promotions";

var liActive = document.getElementById("notifications");
var inputImage = document.getElementById("input-image");
var diplayImage = document.getElementById("display-image");

var logOutButtonElement = document.getElementById('logout');
const imageContainer = document.querySelector('#image-container');
const pushForm = document.querySelector('#push-form');
const storage = getStorage();

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
});

window.addEventListener('DOMContentLoaded', () => {
    liActive.className += " active";
    fichero = pushForm['fichero'];
    //fichero.addEventListener('click', ()=>{
        //document.getElementById("progreso").className = "";
        //document.getElementById("bptexto").textContent = "Waiting ....";
    //});
    fichero.addEventListener('change', subirImagenFirebase, false);

    onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;
            checkIfFileExists();
        } else {

        }
    });

});

function imageExist(){
    var imagePath= usuario + "/promotions/marca-ISDIN-love-your-skin.png";
    const storageFile = ref(storage, imagePath);
    console.log(storageFile.bucket);
}

function checkIfFileExists() {
    imageContainer.innerHTML = "";
    var imagePath= usuario + "/promotions/pushImage.png";
    const storage = getStorage();
    const storageRef = ref(storage, imagePath);
    var html = "";
    getDownloadURL(storageRef)
      .then(url => {
        imageContainer.innerHTML = `
        <div class="container">
            <div class="card text-end" style="width: 25rem;">  
                <img class="card-img-top" src="${url}">
                <div class="card-img-overlay">
                    <button class="btn-delete btn btn-danger" data-id="${imagePath}">X</button>
                </div>
            </div>
        </div>`;

        document.getElementById("input-image").className = "row d-none";
        document.getElementById("display-image").className = "row";
        
        var btnsDelete = imageContainer.querySelectorAll('.btn-delete')
        btnsDelete.forEach((btn) => {
            btn.addEventListener('click', async({ target: { dataset } }) => {
                console.log(dataset.id)
                var userPreference;
                if (confirm("¿Seguro que quiere borrar la imágen?") == true) {
                    userPreference = "Promo Borrada!";
                    const doc = await deleteImage(dataset.id)
                    document.getElementById("input-image").className = "row";
                    document.getElementById("display-image").className = "row d-none";
                } else {
                    userPreference = "Borrar Cancelado!";
                }
                console.log(userPreference);
            });
        })

      })
      .catch(error => {
        if (error.code === 'storage/object-not-found') {
            console.log("File does not exist");
            imageContainer.innerHTML += "No Existe imágen";
            document.getElementById("input-image").className = "row";
            document.getElementById("display-image").className = "row d-none";
        } else {
            console.log("File exists");
        }
      });
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

function subirImagenFirebase (){
    //document.getElementById("progreso").className = "";
    const file = document.getElementById("fichero").files[0];
	//const storage = getStorage();
    
	// Create the file metadata
	/** @type {any} */
	const metadata = {
		contentType: 'image/jpeg'
	};

    //var path = usuario + "/" + folders + "/" + file.name;

    var path = usuario + "/" + folders + "/pushImage.png";

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
            ///document.getElementById("bptexto").textContent = "Complete"
            ///document.getElementById("barra-de-progreso").style.width = progress + "%";
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
            ///document.getElementById("bptexto").textContent = "";
            ///listarImagenes(folders);
            checkIfFileExists();
		}
	);
}