// setting the features for the procedures list popup
let windowFeatures = "popup, left=100, top=100, width=320, height=320";

// appointmentID passed from appointments table with "view" button and viewAppt({{this.appointmentID}})
function viewAppt(apptID){

	let apptProcData = {
		appointmentID: apptID
	}

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/view-appt-procs", true);
	xhttp.setRequestHeader("Content-type", "application/json");

	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// if sent successfully, open popup of view-appt-procs, called by GET
			this.window.open("/view-appt-procs", "ViewProcs", windowFeatures);
		}
		else if(xhttp.readyState == 4 && xhttp.status !=200) {
			console.log("There was an error with the input");
		}
	}
	xhttp.send(JSON.stringify(apptProcData));
}

