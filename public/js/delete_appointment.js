// Citation for following block of code:
// Date: 05/13/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
function deleteAppointment(appointmentID)
{
    let appointmentData = {
        appointmentID: appointmentID
    };


    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-appointment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(appointmentID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input");
        }
    }
    xhttp.send(JSON.stringify(appointmentData));
};

function deleteRow(appointmentID)
{
    let table = document.getElementById("appointments-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("appointment-data-value") == appointmentID) {
            table.deleteRow(i);
            deleteDropDownMenu(appointmentID);
            break;
        }
    }
}

function deleteDropDownMenu(appointmentID)
{
    let selectMenu = document.getElementById("appointmentSelect");
    for (let i = 0; i < selectMenu.clientHeight; i++) {
        if(Number(selectMenu.options[i].value) === Number(appointmentID)) {
            selectMenu[i].remove();
            break;
        }
    }
}