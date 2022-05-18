
let updateProcedureForm = document.getElementById('update-procedure-form');

// modify objects we need
updateProcedureForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputProcedureID = document.getElementById("procedureSelect");
    let inputCost = document.getElementById("input-cost-update");

    // get values from form fields
    let procedureIDValue = inputProcedureID.value;
    let costValue = inputCost.value;

    // for REQUIRED values
    if (isNaN(costValue))
    {
        return;
    }

    // put data we want to send in javascript object
    let procedureData = {
        procedureID: procedureIDValue,
        cost: costValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-procedure", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(costValue, procedureIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(procedureData));

})

function updateRow(costValue, procedureIDValue)
{
    let table = document.getElementById("procedures-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("data-value") == procedureIDValue) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[2];
            td.innerHTML = costValue;
        }
    }
}