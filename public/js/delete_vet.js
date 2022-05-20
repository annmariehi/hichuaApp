// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
function deleteVet(vetID) {

    // put our data we want to send in javascript object
    let vetData = {
        vetID: vetID
    };

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-vet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // remove data from the table
            deleteRow(vetID);
            deleteDropDownMenu(vetID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was a nerror with the input");
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(vetData));
}

function deleteRow(vetID)
{
    let table = document.getElementById("vets-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("vet-data-value") == vetID) {
            table.deleteRow(i);
            break;
        }
    }
}

// not using it but leaving it here for now
function deleteDropDownMenu(vetID){
    let selectMenu = document.getElementById("vetSelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if(Number(selectMenu.options[i].value) === Number(vetID)) {
            selectMenu[i].remove();
            break;
        }
    }
}