// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let updatePetForm = document.getElementById('update-pet-form');

updatePetForm.addEventListener("submit", function (e)
{
    e.preventDefault();

    let inputPetName = document.getElementById("petSelect");
    let inputPetTypeID = document.getElementById("input-pet_type-update");

    let petNameValue = inputPetName.value;
    let petTypeIDValue = inputPetTypeID.value;

    // required value
    if (isNaN(petTypeIDValue))
    {
        return;
    }

    let data = {
        pet_name: petNameValue,
        pet_typeID: petTypeIDValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-pet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            updateRow(xhttp.response, petNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

})

function updateRow(data, petID){
    let parseData = JSON.parse(data);

    let table = document.getElementById("pets-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == petID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parseData[0].type_name;
        }
    }
}