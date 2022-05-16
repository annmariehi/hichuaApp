

let windowFeatures = "popup, left=100, top=100, width=320, height=320";
function viewAppt(apptID){
	console.log("view_appt-proc stop 1: " + apptID);
	let apptIDValue = apptID;
	console.log("view_appt-proc stop 2: " + apptIDValue);
	let apptProcData = {
		appointmentID: apptIDValue
	}
	console.log("view_appt-proc stop 3: " + apptProcData.appointmentID);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/view-appt-procs", true);
	xhttp.setRequestHeader("Content-type", "application/json");

	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			this.window.open("/view-appt-procs", "ViewProcs", windowFeatures);
			console.log("alright");
		}
		else if(xhttp.readyState == 4 && xhttp.status !=200) {
			console.log("There was an error with the input");
		}
	}

	xhttp.send(JSON.stringify(apptProcData));
	console.log("view_appt-proc stop 4: " + JSON.stringify(apptProcData))
}

