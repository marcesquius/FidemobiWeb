import{
	auth,
	onAuthStateChanged,
	signOutUser,
    onGetPromotions,
    //onGetBanners,
    //onGetUserByPromo,
    userExist,
    userPromoExist,
    addPromoToUser,
} from '../utils/firebase.js';

var usuario = "";
var promoId;
var logOutButtonElement = document.getElementById('logout');
var liActive = document.getElementById("subscription");
var promotions = [];
const subscriptionForm = document.querySelector('#subscription-form');
const dropdownPromos = document.querySelector('#promotions-list');

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})

window.addEventListener('DOMContentLoaded', async () => {
    liActive.className += " active";
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;	
            //console.log(usuario);
            onGetPromotions((querySnapshot) => {
				dropdownPromos.innerHTML = "";
                dropdownPromos.add(new Option("Seleccionar...", ""), undefined);
                var i=0;
                querySnapshot.forEach((doc) => {
                    promotions.push(doc);
                    //dropdownPromos.add(new Option(doc.data().name +"-"+ doc.data().company, doc.data().placeId+"-"+doc.id), undefined); //  + "-"+doc.data().name
                    dropdownPromos.add(new Option(doc.data().name +"-"+ doc.data().company, i), undefined); //  + "-"+doc.data().name
                    i++;
                });
            });    
            
        } else {

        }
    });
});

dropdownPromos.addEventListener('change', (e) => {
	e.preventDefault();
	//bannersContainer.innerHTML = '';
    promoId = dropdownPromos.options[dropdownPromos.selectedIndex].value;
    //console.log(promotions[promoId].data());
    if (promoId != "") {
        //console.log(promoId);
		//document.getElementById("showhide").className = "container"
	} else {
		//document.getElementById("showhide").className = "container d-none"
	}
});

subscriptionForm.addEventListener('submit', async(e) => {
	e.preventDefault();
    const code = document.querySelector('#phone-code').value;
    const phone = document.querySelector('#phone-number').value;
    
    if(!promoId){
        alert('Seleccione promoción')
    } else {
        if(!phone){
            alert('número de telefono');
        } else {
            //alert(promoId +"- +"+ code +"-"+phone);
            var userPhone = "+"+ code + phone; 
            const userId = await userExist(userPhone);
            if (userId){
                //console.log(promotions[promoId].data().placeId, promotions[promoId].id ,userId);
                const promoUserExist = await userPromoExist(userId, promotions[promoId].id);
                if(promoUserExist.data()){
                    alert("PROMOCIÓN ACTIVA EN USER")
                } else {
                    // Cargamos Promoción en Usuario
                    //console.log(userId,promotions[promoId].id,promotions[promoId].data());
                    addPromoToUser(userId,promotions[promoId].id,promotions[promoId].data());
                    alert("Promoción Cargada en usuario:" + userPhone);
                }      
            } else {
                alert("Usuario NO EXISTE")
            }
            
        }
    }
    subscriptionForm.reset();
    promoId = "";
});