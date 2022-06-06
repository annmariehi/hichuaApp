// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
function deletePetType(pet_typeID) {

    if(confirm("Are you sure you want to delete? \n This will remove all Pets of this type.") == true)
    {

    // put our data we want to send in javascript object
    let petTypeData = {
        pet_typeID: pet_typeID
    };

    // setup ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-pet_type", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // remove data from the table
            deleteRow(pet_typeID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was a nerror with the input");
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(petTypeData));
    }
    else
    {
        return 0;
    }
}

function deleteRow(pet_typeID)
{
    let table = document.getElementById("pet-types-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("pet-type-data-value") == pet_typeID) {
            table.deleteRow(i);
            break;
        }
    }
}

