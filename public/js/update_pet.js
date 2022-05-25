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

// correctly formats updated birthdate in MM-DD-YYYY
// also adds 1 to day and month because javascript dates are weird
function updateBirthdate(sqlDate)
{
    var jsDate = new Date(sqlDate);
    let day = jsDate.getDate() + 1;
    if(day < 10) {
        day = "0" + day;
    }
    let month = jsDate.getMonth() + 1;
    if(month < 10) {
        month = "0" + month;
    }
    let year = jsDate.getFullYear();
    return(month + "-" + day + "-" + year);
}

function updateRow(responseVal, petData)
{
    let breedVal;
    let dateFormat;

    // if breed is NULL, set table to display blank
    if(parseInt(responseVal) === 0) {
        breedVal = " ";
    } else {
        // else display new breed value
        breedVal = responseVal;
    }

    // format updated birthdate
    dateFormat = updateBirthdate(petData.birthdate);

    let table = document.getElementById("pets-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == petData.pet_name) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let breedTD = updateRowIndex.getElementsByTagName("td")[4];
            let birthdateTD = updateRowIndex.getElementsByTagName("td")[5];
            breedTD.innerHTML = breedVal;
            birthdateTD.innerHTML = dateFormat;
        }
    }
}