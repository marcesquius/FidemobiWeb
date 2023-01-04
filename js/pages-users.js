
import{
	auth,
	onAuthStateChanged,
	signOutUser,
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

//import {  } from 'https://cdn.datatables.net/1.13.1/js/jquery.dataTables.js';
//var DataTables = require('https://cdn.datatables.net/1.13.1/js/jquery.dataTables.js');
//const dt = DataTable();


var usuario = "";
var placeId = "";
var promoId = "";
var liActive = document.getElementById("users");

var logOutButtonElement = document.getElementById('logout');

const dropdownPlaces = document.querySelector('#places-list');
var promotions = [];
const dropdownPromos = document.querySelector('#promotions-list');
//const usersContainer = document.querySelector('#users-container'); // is OK document.getElementById('users-container');
const usersContainer = document.getElementById('users-container');
let t;

logOutButtonElement.addEventListener('click', (e) => {
	e.preventDefault();
	signOutUser();
})

window.addEventListener('DOMContentLoaded', async () => {
    t = new DataTable('#myTable');
    liActive.className += " active";
	onAuthStateChanged(auth, (user) => {
		if (user != null) {
			usuario = auth.currentUser.uid;

            onGetPlaces((querySnapshot) => {
				dropdownPlaces.innerHTML = "";
                dropdownPlaces.add(new Option("Seleccionar...", ""), undefined);
                querySnapshot.forEach(doc => {
                    dropdownPlaces.add(new Option(doc.data().company, doc.id), undefined);
                });           
        	}); 
 
        } else {

        }
    });
});

dropdownPlaces.addEventListener('change', (e) => {
	e.preventDefault();
	//usersContainer.innerHTML = '';
    placeId = dropdownPlaces.options[dropdownPlaces.selectedIndex].value;
    if (placeId != "") {
        onGetPromos(placeId,(querySnapshot) => {
            dropdownPromos.innerHTML = "";
            dropdownPromos.add(new Option("Seleccionar...", ""), undefined);
            var i=0;
            querySnapshot.forEach((doc) => {
                promotions.push(doc);
                //dropdownPromos.add(new Option(doc.data().name +"-"+ doc.data().company, doc.data().placeId+"-"+doc.id), undefined); //  + "-"+doc.data().name
                //dropdownPromos.add(new Option(doc.data().name +"-"+ doc.data().company, i), undefined); //  + "-"+doc.data().name
                dropdownPromos.add(new Option(doc.data().name +"-"+ doc.data().company, doc.id), undefined);
                i++;
            });
        });
		//document.getElementById("showhide").className = "container"
		//readBenners()
	} else {
		//document.getElementById("showhide").className = "container d-none"
	}
})



//var tbodyRef0 = document.getElementById('myTable').getElementsByTagName('tbody')[0];
//var tbodyRef1 = document.getElementById('myTable').getElementsByTagName('tbody')[1];
//var tbodyRef2 = document.getElementById('myTable').getElementsByTagName('tbody')[2];
//var tbodyRef3 = document.getElementById('myTable').getElementsByTagName('tbody')[3];
//var tbodyRef4 = document.getElementById('myTable').getElementsByTagName('tbody')[4];

// Insert a row at the end of table
//var newRow0 = tbodyRef0.insertRow();
//var newRow1 = tbodyRef1.insertRow();
//var newRow2 = tbodyRef2.insertRow();
//var newRow3 = tbodyRef3.insertRow();
//var newRow4 = tbodyRef4.insertRow();

// Insert a cell at the end of the row
//var newCell0 = newRow0.insertCell();
//var newCell1 = newRow1.insertCell();
//var newCell2 = newRow2.insertCell();
//var newCell3 = newRow3.insertCell();
//var newCell4 = newRow4.insertCell();


/** 
function adRow(myTable) {
    var table = document.getElementById(myTable);
    var row = table.getElementsByTagName('tr');
    var row = row[row.length-1].outerHTML;
    table.innerHTML = table.innerHTML + row;
    var row = table.getElementsByTagName('tr');
    var row = row[row.length-1].getElementsByTagName('td');
    for(i=0;i<row.length;i++){
      row[i].innerHTML = '';
    }
  }
*/


/////
//https://stackoverflow.com/questions/18333427/how-to-insert-a-row-in-an-html-table-body-in-javascript

/*
var tbodyRef0 = document.getElementById('myTable').getElementsByTagName('tbody')[0];
var newRow0 = tbodyRef0.insertRow();

let myTable = document.getElementById('myTable').getElementsByTagName('tbody')[0];
let row;
row = myTable.deleteRow(0);
*/
/////


dropdownPromos.addEventListener('change', (e) => {
	e.preventDefault();

    //let t = new DataTable('#myTable');
    t.clear().draw();
    //var counter = 1;
    //t.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);


	usersContainer.innerHTML = '';
    promoId = dropdownPromos.options[dropdownPromos.selectedIndex].value;
    //console.log(promotions[promoId].data());
    if (promoId != "") {

    var html = ""; 
    // Remove all rows from table
    ///while(myTable.hasChildNodes())
    ///{
        ///myTable.removeChild(myTable.firstChild);
    ///}
    //console.log(placeId);
        onGetUserByPromo(placeId, async(querySnapshot) => {
            //let t = new DataTable('#myTable');
            //var counter = 1;
            //t.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);        
            querySnapshot.forEach(async(doc) =>{
                //console.log("doc.id: " + doc.id)
                //console.log("promoId: " + promoId)
                if (doc.id==promoId){
                    var userData = await getUser(doc.ref.parent.parent.id); //${doc.ref.parent.parent.id}
                    //t.row.add([userData.data().fullName, userData.data().phone, formatDate(doc.data().created.toDate()),'-',doc.data().validated]).draw(false);
                    t.row.add([userData.data().name, userData.data().phone, formatDate(doc.data().created.toDate()),'-',doc.data().validated]).draw(false);
/*
                    row = myTable.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);
                    let cell5 = row.insertCell(4);

                    cell1.innerHTML = userData.data().fullName;
                    cell2.innerHTML = userData.data().phone;
                    cell3.innerHTML = formatDate(doc.data().created.toDate()) ;
                    cell4.innerHTML = "-";
                    cell5.innerHTML = doc.data().validated;
*/

                } else {
                    usersContainer.innerHTML = "No data";
                }
            })
            
        })
        
        //console.log(html);
		document.getElementById("showhide").className = "card flex-fill"
	} else {
		document.getElementById("showhide").className = "card flex-fill d-none"
	}
    //usersContainer.innerHTML += `</table>`;
});