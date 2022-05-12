// get objects we need to modify
let updateOwnerForm = document.getElementById('update-owner-form');

// modify objects we need
updateOwnerForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputOwnerName = document.getElementById("mySelect");
    let inputEmail = document.getElementById("input-email-update");

    // get values from form fields
    let ownerNameValue = inputOwnerName.value;
    let emailValue = inputEmail.value;

    // for REQUIRED values

    if (isNaN(emailValue))
    {
        return;
    }

    // put data we want to send in javascript object
    let data = {
        owner_name: ownerNameValue,
        email: emailValue
    }

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-owner", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new data to table
            updateRow(xhttp.response, ownerNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, ownerID){
    let parseData = JSON.parse(data);

    let table = document.getElementById("owners-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("data-value") == ownerID) {

            // get location of row where matching pet ID is
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // get td of pet_type value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // reassign pet_type to value we updated to
            td.innerHTML = parseData[0].email;
        }
    }
}