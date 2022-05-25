// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let updatePetForm = document.getElementById('update-pet-form');

updatePetForm.addEventListener("submit", function (e)
{
    e.preventDefault();

    let inputPetName = document.getElementById("petSelect");
    let inputBreed = document.getElementById("input-breed-update");
    let inputBirthdate = document.getElementById("input-birthdate-update")

    let petNameValue = inputPetName.value;
    let breedValue = inputBreed.value;
    let birthdateValue = inputBirthdate.value;


    let data = {
        pet_name: petNameValue,
        breed: breedValue,
        birthdate: birthdateValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-pet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            updateRow(xhttp.response, data);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

})

function updateRow(responseVal, petData)
{
    let breedVal;

    if(parseInt(responseVal) === 0) {
        breedVal = " ";
    } else {
        breedVal = responseVal;
    }

    let table = document.getElementById("pets-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == petData.pet_name) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let breedTD = updateRowIndex.getElementsByTagName("td")[4];
            let birthdateTD = updateRowIndex.getElementsByTagName("td")[5];
            breedTD.innerHTML = breedVal;
            birthdateTD.innerHTML = petData.birthdate;
        }
    }
}