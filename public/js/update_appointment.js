let updateProcedureForm = document.getElementById('update-appointment-form');

updateProcedureForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputAppointmentID = document.getElementById("appointmentSelect");
    let inputAppointmentDate = document.getElementById('input-date-update');
    let inputExamRoom = document.getElementById('input-exam_room-update');
    let inputRequestedVet = document.getElementById('input-requested_vetID-update');

    // get values of checkboxes and put them in array
    let inputProcedures = document.querySelectorAll('input[type="checkbox"]:checked');
    let procedureArray = new Array;
    for(var checkbox of inputProcedures) {
        procedureArray.push(checkbox.value);
    }

    // get values from form fields
    let appointmentIDValue = inputAppointmentID.value;
    let appointmentDateValue = inputAppointmentDate.value;
    let examRoomValue = inputExamRoom.value;
    let requestedVetValue = inputRequestedVet.value;


    // put data we want to send in javascript object
    let appointmentUpdateData = {
        appointmentID: appointmentIDValue,
        appointment_date: appointmentDateValue,
        exam_roomID: examRoomValue,
        requested_vetID: requestedVetValue,
        procedures: procedureArray
    }

    console.log(appointmentUpdateData);

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-appointment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, appointmentUpdateData);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(appointmentUpdateData));

})

function updateRow(responseVal, appointmentData)
{
    let vetName;
    let dateFormat;
    // if returned value was string of 0, set vetName to be blank
    if(parseInt(responseVal) === 0) {
        vetName = " ";
    } else {
        // else set it to the vet name that was sent
        vetName = responseVal;
    }
    var jsDate = new Date(appointmentData.appointment_date);
    dateFormat = jsDate.toDateString();

    let table = document.getElementById("appointments-table");
    // fix appointment date
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("appointment-data-value") == appointmentData.appointmentID) {

            // display new exam room and date in table
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let examTD = updateRowIndex.getElementsByTagName("td")[2];
            let dateTD = updateRowIndex.getElementsByTagName("td")[4];
            let vetTD = updateRowIndex.getElementsByTagName("td")[3];
            examTD.innerHTML = appointmentData.exam_roomID;
            dateTD.innerHTML = dateFormat;
            vetTD.innerHTML = vetName;
        }
    }
}