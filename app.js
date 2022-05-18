// App.js
// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

// Express
var express = require('express');
var app     = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

PORT        = 50689;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
var moment = require('moment');
app.engine('.hbs', engine({
    extname: ".hbs",
    layoutsDir: 'views/layouts',
    defaultLayout: 'main.hbs',
    helpers: require("./public/js/helpers.js").helpers
}));
app.set('view engine', '.hbs');


// Static Files
app.use(express.static('public'));


/*
    ROUTES
*/

//////////////////////////////////// Home Page //////////////////////////////////////
// display home
app.get('/', function(req,res)
{
    res.render('index');
});

////////////////////////////////// Exam Rooms Page ///////////////////////////////////
// display exam-rooms page
app.get('/exam-rooms', function(req, res)
{
    let displayExamRooms = "SELECT * FROM Exam_Rooms;";

    db.pool.query(displayExamRooms, (error, rows, fields) => {
        res.render('exam-rooms', {examRoomData: rows});
    })
});

// add exam-rooms page
app.post('/add-exam-room-form', function(req, res)
{
    let examRoomData = req.body;

    let createExamRoom = `INSERT INTO Exam_Rooms(exam_roomID) VALUES ("${examRoomData['input-exam_roomID']}");`;
    db.pool.query(createExamRoom, (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/exam-rooms');
        }
    });
});

///////////////////////////////// Apointments Page ///////////////////////////////////

// DISPLAY APPOINTMENT PAGE
app.get('/appointments', function(req,res)
{
   let displayAppointments;

   // search
   if(req.query.petID === undefined) {
       displayAppointments = "SELECT * FROM Appointments;";
   } else {
       let inputPetID = parseInt(req.query.petID);
       displayAppointments = `SELECT * FROM Appointments WHERE petID = ${inputPetID}`;
   }

   // Queries for populating table/drop downs/checkboxes
   let petDropDown = "SELECT * FROM Pets;";
   let examRoomDropDown = "SELECT * FROM Exam_Rooms;";
   let apptUpdateDropDown = "SELECT Pets.pet_name, Pets.petID, Appointments.appointmentID FROM Pets JOIN Appointments ON Pets.petID = Appointments.petID;";
   let apptUpdateProcedures = "SELECT * FROM Procedures;";

   db.pool.query(displayAppointments, (error, rows, fields) => {
        let appointmentData = rows;

        // populate pet drop down queries
        db.pool.query(petDropDown, (error, rows, fields) => {
            let pets = rows;

            // array map to replace petID with pet name in appointments table
            let petmap = {}
            pets.map(pet => {
                let petID = parseInt(pet.petID, 10);
                petmap[petID] = pet["pet_name"];
            });

            // populate examroom dropdown
            db.pool.query(examRoomDropDown, (error, rows, fields) => {
                let exam_rooms = rows;

                // populate appointmentID/pets dropdown
                db.pool.query(apptUpdateDropDown, (error, selects, fields) => {
                    let petApptIDs = selects;

                    // populate procedures checkboxes
                    db.pool.query(apptUpdateProcedures, (error, results, fields) => {
                        let updateProcs = results;

                        // overwrite petID with name of pet in appointment table
                        appointmentData = appointmentData.map(appointment => {
                            return Object.assign(appointment, {petID: petmap[appointment.petID]})
                        });

                        return res.render('appointments', {appointmentData: appointmentData, updateProcs: updateProcs, petApptIDs: petApptIDs, pets: pets, exam_rooms: exam_rooms})
                    });
                });
            });
        });
    });
});


// ADD APPOINTMENT
let newApptInfo; // set with POST add-appointment-form read by GET appointment-procedures
app.post('/add-appointment-form', function(req, res)
{
    let appointmentData = req.body;

    let createAppointment = `INSERT INTO Appointments(petID, exam_roomID, appointment_date) VALUES('${appointmentData['input-petID']}', '${appointmentData['input-exam_roomID']}', '${appointmentData['input-appointment_date']}')`;
    newApptInfo = {
        petID: appointmentData['input-petID'],
        appointment_date: appointmentData['input-appointment_date']
    }
    db.pool.query(createAppointment, (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            // creates new appointment then goes to next page to add procedures to just added appointment
            res.redirect('/appointment-procedures');
        }
    });
});


// DISPLAY PROCEDURES FOR ADD APPOINTMENT
let procApptID; // set with GET appointment-procedures, read by POST appointment-procedures to bulk insert into intersection table
app.get('/appointment-procedures', function(req,res)
{
    // query to get list of procedures to display
    let displayProcedures = "SELECT * FROM Procedures;";

    // query to get pet's name for appointment were adding procedures to
    let apptPetName = `SELECT * FROM Pets WHERE PetID = ${newApptInfo.petID}`;

    // query to get most recently added appointment (the one we just created with add-appointment-form)
    let apptInfoQuery = "SELECT * FROM Appointments ORDER BY appointmentID DESC LIMIT 1;";

    db.pool.query(displayProcedures, (error, responseVal, fields) => {
        // procedures
        let options = responseVal;

        db.pool.query(apptPetName, (error, responseVal, fields) => {
            // pets name
            let apptPet = responseVal[0].pet_name;

            db.pool.query(apptInfoQuery, (error, responseVal, fields) => {
                let apptInfo = responseVal;
                // setting procApptID with appointmentID
                // also getting appointmentID and appointment_date for page prompt
                // could just use newApptInfo.appointment_date but oh well
                procApptID = apptInfo[0].appointmentID;
                let procApptDate = apptInfo[0].appointment_date;

                res.render('appointment-procedures', {procApptID: procApptID, procApptDate: procApptDate, procedureOptions: options, apptPet: apptPet, layout: 'blank'});
            });
        });
    });
});


// ADD PROCEDURES TO NEW APPOINTMENT
app.post('/add-appointment-procedure-form', function(req, res) {
    let procs = req.body;

    // counts number of checkboxes checked (only values sent in req.body)
    let count = Object.keys(procs).length;

    // TO DO: insert if statement if count = 0 delete appointment

    // create array of procedureIDs sent in req.body (only sent if checkbox is checked)
    let procsArray = new Array;
    for (const [index, productID] of Object.entries(procs)) {
        procsArray.push(productID);
        console.log(productID);
    }
    console.log(procsArray);
    console.log(procApptID);

    // create array of arrays with same appointmentID and different procedureIDs
    let procVals = [];
    for(i = 0; i < procsArray.length; i++) {
        procVals[i] = [procApptID, parseInt(procsArray[i])];
    }
    console.log(procVals);

    // "bulk insert" array of arrays into Appointment_has_Procedure so appointment has multiple procedures
    let createAppointmentProcedures = `INSERT INTO Appointment_has_Procedure(appointmentID, procedureID) VALUES ?`;
    db.pool.query(createAppointmentProcedures, [procVals], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // go back to appointments page where new appointment and its procedures now displayed
            res.redirect('/appointments');
        }
    });
});


// VIEW APPOINTMENT PROCEDURES
// POST assigns "apptProcsView" "apptPetName" GET uses it and passes to handlebars
let apptProcsView;
let apptPetName;
app.post('/view-appt-procs', function(req, res)
{
    let apptID = parseInt(req.body.appointmentID);

    // get all procedure information where procedureID matches the passed appointmentID in Appointment_has_Procedure
    let disApptProcs = `SELECT Procedures.procedureID, Procedures.proc_name, Procedures.cost FROM Appointment_has_Procedure JOIN Procedures ON Appointment_has_Procedure.procedureID = Procedures.procedureID WHERE Appointment_has_Procedure.appointmentID = ${apptID}`;
    // get the pet name for the appointment
    let disPetName = `SELECT Pets.pet_name FROM Appointments JOIN Pets ON Appointments.petID = Pets.petID WHERE Appointments.appointmentID = ${apptID}`;

    db.pool.query(disApptProcs, (error, results, fields) => {
        apptProcsView = results;

        db.pool.query(disPetName, (error, results, fields) => {
            apptPetName = results[0].pet_name;
            res.sendStatus(200);
        });
    });
});

// rendering work POST did on popup page
app.get('/view-appt-procs', function(req, res)
{
    res.render('view-appt-procs', {apptProcs: apptProcsView, apptPetName: apptPetName, layout: 'blank'});
});


// UPDATE APPOINTMENT
app.put('/put-appointment', function(req, res, next) {

    // getting pieces of appointment information from update_appointment.js
    let updateAppointmentData = req.body;
    let appointmentID = updateAppointmentData.appointmentID;
    let appointment_date = updateAppointmentData.appointment_date;
    let exam_roomID = updateAppointmentData.exam_roomID;

    // putting new procedures in array of arrays with same appointmentID and different procedureIDs
    let proceduresArray = updateAppointmentData.procedures;
    let updateProcs = [];
    for(i = 0; i < proceduresArray.length; i++) {
        updateProcs[i] = [appointmentID, proceduresArray[i]];
    }

    // update appointment
    let updateAppointmentQuery = "UPDATE Appointments SET appointment_date = ?, exam_roomID = ? WHERE Appointments.appointmentID = ?;"

    // clear out all the Appointment_has_Procedure rows with this appointmentID, insert the new procedures under this appointmentID
    let clearProcedures = "DELETE FROM Appointment_has_Procedure WHERE appointmentID = ?"
    let updateProcedures = "INSERT INTO Appointment_has_Procedure VALUES ?"

    // running all queries, checking for errors each time
    db.pool.query(updateAppointmentQuery, [appointment_date, exam_roomID, appointmentID], (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(clearProcedures, [appointmentID], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(updateProcedures, [updateProcs], (error, rows, fields) => {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // send all good status back to update_appointment.js
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});


// DELETE APPOINTMENT
app.delete('/delete-appointment', function(req, res, next)
{
    let appointmentData = req.body;
    let appointmentID = parseInt(appointmentData.appointmentID);

    // will cascade and delete all Appointment_has_Procedure rows with that appointmentID
    let deleteAppointment = 'DELETE FROM Appointments WHERE appointmentID = ?';

    db.pool.query(deleteAppointment, [appointmentID], (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

////////////////////////////////////// Owners Page/////////////////////////////////////////////

// DISPLAY OWNERS PAGE
app.get('/owners', function(req,res)
{
    let displayOwners;

    // search
    if(req.query.owner_name === undefined) {
        displayOwners = "SELECT * FROM Owners;";
    } else {
        displayOwners = `SELECT * FROM Owners WHERE owner_name LIKE "${req.query.owner_name}%"`;
    }

    db.pool.query(displayOwners, (error, rows, fields) => {
        res.render('owners', {Owner: rows});
    });
});


// ADD OWNER
app.post('/add-owner-form', function(req, res)
{
    let ownerData = req.body;
    let createOwnerQuery = `INSERT INTO Owners(owner_name, email) VALUES ('${ownerData['input-owner_name']}', '${ownerData['input-email']}');`;

    db.pool.query(createOwnerQuery, (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/owners');
        }
    });
});


// UPDATE OWNER
app.put('/put-owner', function(req,res,next)
{
    let ownerData = req.body;
    let email = ownerData.email;
    let ownerID = parseInt(ownerData.ownerID);

    let queryUpdateOwnerEmail = 'UPDATE Owners SET email = ? WHERE Owners.ownerID = ?';

    db.pool.query(queryUpdateOwnerEmail, [email, ownerID], (error, rows, fields) => {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }
    });
});


////////////////////////////////////////// Pet Types Page /////////////////////////////////////////

// DISPLAY PET TYPES
app.get('/pet-types', function(req, res)
{
    let displayPetTypes = "SELECT * FROM Pet_Types;";

    db.pool.query(displayPetTypes, (error, rows, fields) => {
        res.render('pet-types', {typeData: rows});
    });
});


// ADD PET TYPE
app.post('/add-pet-type-form', function(req, res)
{
    let typeData = req.body;
    let createPetTypeQuery = `INSERT INTO Pet_Types(type_name) VALUES ("${typeData['input-type_name']}");`;

    db.pool.query(createPetTypeQuery, (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/pet-types');
        }
    });
});


//////////////////////////////////////// Veterinarians Page ////////////////////////////////////////

// DISPLAY VETERINARIANS PAGE
app.get('/veterinarians', function(req,res)
{
    let displayVets = "SELECT * FROM Veterinarians;";

    db.pool.query(displayVets, (error, response, fields) => {
        res.render('veterinarians', {vetData: response});
    });
});


// ADD VETERINARIAN
app.post('/add-vet-form', function(req, res)
{
    let vetData = req.body;
    createVetQuery = `INSERT INTO Veterinarians(vet_name) VALUES ("${vetData['input-vet_name']}");`;

    db.pool.query(createVetQuery, (error, rows, fields) => {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/veterinarian-procedures');
        }
    });
});

// DISPLAY PROCEDURES FOR ADD VETERINARIAN
let procVetID; //
app.get('/veterinarian-procedures', function(req, res)
{
    let displayProcedures = "SELECT * FROM Procedures;";
    let vetInfoQuery = "SELECT * FROM Veterinarians ORDER BY vetID DESC LIMIT 1;";

    db.pool.query(displayProcedures, function(error, responseVal, fields) {
        let options = responseVal;

        // get info from most recently added vet (will have the highest vetID)
        db.pool.query(vetInfoQuery, function(error, responseVal, fields) {
            let vetInfo = responseVal;
            procVetID = vetInfo[0].vetID;
            vetName = vetInfo[0].vet_name;

            res.render('veterinarian-procedures', {vetName: vetName, procedureOptions: options, layout: 'blank'});
        });
    });
});

// ADD PROCEDURES TO VETERINARIAN
app.post('/add-veterinarian-procedures-form', function(req, res)
{
    let procs = req.body;

    // number of procedures added to veterinarian
    let count = Object.keys(procs).length;

    // TO DO: insert if statement if count = 0, delete vet OR just make checkbox required before submit

    // put procedureIDs into array
    let procsArray = new Array;
    for(const [index, procedureID] of Object.entries(procs)) {
        procsArray.push(procedureID);
    }

    // put procedureIDs and vetID into array of arrays
    let procVals = [];
    for(i = 0; i < procsArray.length; i++) {
        procVals[i] = [parseInt(procsArray[i]), procVetID];
    }

    // bulk insert with array of arrays multiple procedureIDs to the same vetID in Procedure_has_Vet
    let createVetProcedures = `INSERT INTO Procedure_has_Vet(procedureID, vetID) VALUES ?`
    db.pool.query(createVetProcedures, [procVals], (error, results, fields) => {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/veterinarians');
        }
    });
});


// DISPLAY VETERINARIAN PROCEDURES
// POST assigns "vetProcsView" and "vetNameView" so GET can pass it to handlebars
let vetProcsView;
let vetNameView;
app.post('/view-vet-procs', function(req, res)
{
    let vetID = parseInt(req.body.vetID);

    let disVetName = `SELECT * FROM Veterinarians WHERE vetID = ${vetID}`;
    // get procedure information where procedureID matches passed vetID in Procedure_has_Vet
    let disVetProcs = `SELECT Procedures.procedureID, Procedures.proc_name, Procedures.cost FROM Procedure_has_Vet JOIN Procedures ON Procedure_has_Vet.procedureID = Procedures.procedureID WHERE Procedure_has_Vet.vetID = ${vetID}`;

    db.pool.query(disVetProcs, (error, results, fields) => {
        vetProcsView = results;

        db.pool.query(disVetName, (error, results, fields) => {
            vetNameView = results[0].vet_name;
            res.sendStatus(200);
        });
    });
});

// literally just renders all the work post did
app.get('/view-vet-procs', function(req, res)
{
    res.render('view-vet-procs', {vetProcs: vetProcsView, vetInfo: vetNameView, layout: 'blank'});
});


///////////////////////////////////////// Procedures Page ///////////////////////////////////////////

// DISPLAY PROCEDURES PAGE
app.get('/procedures', function(req,res)
{
    let displayProcedures = 'SELECT * FROM Procedures;';

    db.pool.query(displayProcedures, (error, rows, fields) => {
        res.render('procedures', {procedureData: rows});
    });
});


// ADD PROCEDURES
app.post('/add-procedure-form', function(req, res)
{
    let procedureData = req.body;
    let createProcedure = `INSERT INTO Procedures(proc_name, cost) VALUES ('${procedureData['input-proc_name']}', '${procedureData['input-cost']}');`;

    db.pool.query(createProcedure, (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/procedures');
        }
    });
});


// UPDATE PROCEDURES
app.put('/put-procedure', function(req,res,next)
{
    let procedureData = req.body;

    let procedureID = parseInt(procedureData.procedureID);
    let cost = parseInt(procedureData.cost);

    let updateProcedureQuery = 'UPDATE Procedures SET cost = ? WHERE Procedures.procedureID = ?';

    db.pool.query(updateProcedureQuery, [cost, procedureID], (error, rows, fields) => {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});


/////////////////////////////////////////// Pets Page /////////////////////////////////////////////////
// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// DISPLAY PETS PAGE
app.get('/pets', function(req, res)
{
    let displayPets;

    // search
    if(req.query.pet_name === undefined) {
        displayPets = "SELECT * FROM Pets;";
    } else {
        displayPets = `SELECT * FROM Pets WHERE pet_name LIKE "${req.query.pet_name}%"`
    }

    // Populate Pet_Types dropdown
    let petsTypesDropDown = "SELECT * FROM Pet_Types;";

    // Populate Owners dropdown
    let ownersDropDown = 'SELECT * FROM Owners;';

    db.pool.query(displayPets, (error, rows, fields) => {
        let pets = rows;

        // Populate dropdown query
        db.pool.query(petsTypesDropDown, (error, rows, fields) => {
            let pet_types = rows;

            // make array map to repalce pet_typeIDs with type_names in Pets table
            let pet_typemap = {};
            pet_types.map(pet_type => {
                let pet_typeID = parseInt(pet_type.pet_typeID, 10);
                pet_typemap[pet_typeID] = pet_type["type_name"];
            });

            // populate owner dropdown
            db.pool.query(ownersDropDown, (error, rows, fields) => {
                let owners = rows;

                // make array map to replace ownerIDs with owner_name in Pets table
                let owner_map = {}
                owners.map(owner => {
                    let ownerID = parseInt(owner.ownerID, 10);
                    owner_map[ownerID] = owner["owner_name"];
                });

                // overwrite ownerID/owner_name and pet_typeID/type_name
                pets = pets.map(pet => {
                    return Object.assign(pet, {pet_typeID: pet_typemap[pet.pet_typeID]}, {ownerID: owner_map[pet.ownerID]});
                });

                return res.render('pets', {data: pets, pet_types: pet_types, owners: owners});
            });
        });
    });
});


// DELETE PET
app.delete('/delete-pet', function(req,res,next)
{
    let petData = req.body;
    let petID = parseInt(petData.petID);
    let deletePet = `DELETE FROM Pets WHERE petID = ?`;

    db.pool.query(deletePet, [petID], (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


// UPDATE PET
app.put('/put-pet', function(req,res,next)
{
    let petData = req.body;

    let pet_typeID = parseInt(petData.pet_typeID);
    let pet = parseInt(petData.pet_name);

    let queryUpdatePetType = 'UPDATE Pets SET pet_typeID = ? WHERE Pets.petID = ?';
    let selectPetType = 'SELECT * FROM Pet_Types WHERE pet_typeID = ?'

    // run first query
    db.pool.query(queryUpdatePetType, [pet_typeID, pet], (error, rows, fields) => {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        // if no error, run second query and return that data so we can use it to update
        // pets table
        } else {
            // run second query
            db.pool.query(selectPetType, [pet_typeID], (error, rows, fields) => {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});


// ADD PET
app.post('/add-pet-form', function(req, res)
{
    let petData = req.body;

    // Capture NULL values
    let breed = petData['input-breed'];
    if (breed === undefined) {
        breed = 'NULL';
    }

    createPetQuery = `INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate) VALUES ('${petData['input-pet_name']}', '${petData['input-ownerID']}', '${petData['input-pet_typeID']}', '${breed}', '${petData['input-birthdate']}');`;
    db.pool.query(createPetQuery, (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/pets');
        }
    });
});


/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log('Express started on http://localhost: ' + PORT + '; press Ctrl-C to terminate.')
});