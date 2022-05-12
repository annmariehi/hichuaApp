function deletePet(petID) {

    // put our data we want to send in javascript object
    let data = {
        petID: petID
    };

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-pet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // remove data from the table
            deleteRow(petID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was a nerror with the input");
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(petID){

    let table = document.getElementById("pets-table");
    for (let i = 0, row; row = talbe.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("data-value") == petID) {
            table.deleteRow(i);
            deleteDropDownMenu(petID);
            break;
        }
    }
}

function deleteDropDownMenu(petID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if(Number(selectMenu.options[i].value) === Number(petID)){
            selectMenu[i].remove();
            break;
        }
    }
}