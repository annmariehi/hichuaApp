
let updateProcedureForm = document.getElementById('update-appointment-form');

// modify objects we need
updateProcedureForm.addEventListener("submit", function (e) {

    // prevent form from submitting
    e.preventDefault();

    // get form fields we need data from
    let inputAppointmentID = document.getElementById("appointmentSelect");
    let inputAppointmentDate = document.getElementById('input-date-update');
    let inputExamRoom = document.getElementById('input-exam_room-update');
    let inputProcedures = document.querySelectorAll('input[type="checkbox"]:checked');
    let procedureArray = new Array;
    for(var checkbox of inputProcedures) {
        procedureArray.push(checkbox.value);
    }
    console.log(procedureArray);

    // get values from form fields
    let appointmentIDValue = inputAppointmentID.value;
    let appointmentDateValue = inputAppointmentDate.value;
    let examRoomValue = inputExamRoom.value;

    // put data we want to send in javascript object
    let appointmentUpdateData = {
        appointmentID: appointmentIDValue,
        appointment_date: appointmentDateValue,
        exam_roomID: examRoomValue,
        procedures: procedureArray
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-appointment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(appointmentUpdateData, appointmentIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // send request and wait for response
    xhttp.send(JSON.stringify(appointmentUpdateData));

})

function updateRow(appointmentData, appointmentID) {

    let table = document.getElementById("appointments-table");
    // fix appointment date
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate thru rows
        if (table.rows[i].getAttribute("appointment-data-value") == appointmentID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let examTD = updateRowIndex.getElementsByTagName("td")[2];
            let dateTD = updateRowIndex.getElementsByTagName("td")[3];
            examTD.innerHTML = appointmentData.exam_roomID;
            dateTD.innerHTML = appointmentData.appointment_date;
        }
    }
}