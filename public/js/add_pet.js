// get objects need to modify
let addPetForm = document.getElementById('add-pet-form');

// modify objects we need
addPetForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let inputPetName = document.getElementById('input-pet_name');
    let inputOwnerID = document.getElementById('input-ownerID');
    let inputPetTypeID = document.getElementById('input-pet_typeID');
    let inputBreed = document.getElementById('input-breed');
    let inputBirthdate = document.getElementById('input-birthdate');

    // get values from form fields
    let petNameValue = inputPetName.value;
    let ownerIDValue = inputOwnerID.value;
    let petTypeIDValue = inputPetTypeID.value;
    let breedValue = inputBreed.value;
    let birthdateValue = inputBirthdate.value;

    // put data we want to send in javascript object
    let data = {
        pet_name: petNameValue,
        ownerID: ownerIDValue,
        pet_typeID: petTypeIDValue,
        breed: breedValue,
        birthdate: birthdateValue
    }

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-pet", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add the new data to the table
            addRowToTable(xhttp.response);

            // clear the input fields for another transaction
            inputPetName.value = '';
            inputOwnerID.value = '';
            inputPetTypeID.value = '';
            inputBreed.value = '';
            inputBirthdate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {

    // get reference to current table on the page and clear it out
    let currentTable = document.getElementById("pets-table");

    // get the location where we should insert the new row
    let newRowIndex = currentTable.rows.length;

    // get a reference to the new row from the database query
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // create a new row and 5 cells
    let row = document.createElement("TR");
    let petIDCell = document.createElement("TD");
    let petNameCell = document.createElement("TD");
    let ownerIDCell = document.createElement("TD");
    let petTypeIDCell = document.createElement("TD");
    let breedCell = document.createElement("TD");
    let birthdateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    petIDCell.innerText = newRow.petID;
    petNameCell.innerText = newRow.pet_name;
    ownerIDCell.innerText = newRow.ownerID;
    petTypeIDCell.innerText = newRow.pet_typeID;
    breedCell.innerText = newRow.breed;
    birthdateCell.innerText = newRow.birthdate;

    deleteCell = document.createElement("button");
    deleteCell.innerHtml = "Delete";
    deleteCell.onclick = function(){
        deletePet(newRow.PetID);
    };

    // add the cells to the row
    row.appendChild(petIDCell);
    row.appendChild(petNameCell);
    row.appendChild(ownerIDCell);
    row.appendChild(petTypeIDCell);
    row.appendChild(breedCell);
    row.appendChild(birthdateCell);
    row.appendChild(deleteCell);

    // add custom row attribute so deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // add the row to the table
    currentTable.appendChild(row);

    // drop down menu
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.pet_name;
    option.value = newRow.petID;
    selectMenu.add(option);
}