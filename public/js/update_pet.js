// get objects we need to modify
let updatePetForm = document.getElementById('update-pet-form');

// modify objects we need
updatePetForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputPetName = document.getElementById("petSelect");
    let inputPetTypeID = document.getElementById("input-pet_type-update");

    // get values from form fields
    let petNameValue = inputPetName.value;
    let petTypeIDValue = inputPetTypeID.value;

    // for REQUIRED values

    if (isNaN(petTypeIDValue))
    {
        return;
    }

    // put data we want to send in javascript object
    let data = {
        pet_name: petNameValue,
        pet_typeID: petTypeIDValue
    }

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-pet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new data to table
            updateRow(xhttp.response, petNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, petID){
    let parseData = JSON.parse(data);

    let table = document.getElementById("pets-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("data-value") == petID) {

            // get location of row where matching pet ID is
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // get td of pet_type value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // reassign pet_type to value we updated to
            td.innerHTML = parseData[0].type_name;
        }
    }
}