
let updateOwnerForm = document.getElementById('update-owner-form');

// modify objects we need
updateOwnerForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputOwnerID = document.getElementById("ownerSelect");
    let inputEmail = document.getElementById("input-email-update");

    // get values from form fields
    let ownerIDValue = inputOwnerID.value;
    let emailValue = inputEmail.value;

    // for REQUIRED values


    // put data we want to send in javascript object
    let ownerData = {
        ownerID: ownerIDValue,
        email: emailValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-owner", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, ownerIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(ownerData));

})

function updateRow(ownerData, ownerIDVal){
    let parseData = JSON.parse(ownerData);
    let table = document.getElementById("owners-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("data-value") == ownerIDVal) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[2];
            td.innerHTML = parseData[0].email;
        }
    }
}