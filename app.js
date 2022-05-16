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
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT        = 50689;

// Database
var db = require('./database/db-connector');

// Handlebars

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
var moment = require('moment');
const res = require('express/lib/response');
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
    let displayExamRooms = "SELECT * FROM Exam_Rooms;"

    db.pool.query(displayExamRooms, function(error, rows, fields) {
        res.render('exam-rooms', {examRoomData: rows});
    })
});

// add exam-rooms page
app.post('/add-exam-room-form', function(req, res)
{
    let examRoomData = req.body;

    let createExamRoom = `INSERT INTO Exam_Rooms(exam_roomID) VALUES ("${examRoomData['input-exam_roomID']}");`;
    db.pool.query(createExamRoom, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/exam-rooms');
        }
    });
});

///////////////////////////////// Apointments Page ///////////////////////////////////
// display appointments page
app.get('/appointments', function(req,res)
{
   let displayAppointments;
   if(req.query.petID === undefined)
   {
       displayAppointments = "SELECT * FROM Appointments;";
   }
   else
   {
       let inputPetID = parseInt(req.query.petID);
       displayAppointments = `SELECT * FROM Appointments WHERE petID = ${inputPetID}`;
   }

   // Populate pet dropdowns
   let petDropDown = "SELECT * FROM Pets;";

   // Populate exam-room dropdown
   let examRoomDropDown = "SELECT * FROM Exam_Rooms;";

   db.pool.query(displayAppointments, function(error, rows, fields){
        // save appointments
        let appointmentData = rows;

        // populate pet drop down queries
        db.pool.query(petDropDown, (error, rows, fields) => {

            // save pets
            let pets = rows;

            // construct object for reference
            let petmap = {}
            pets.map(pet => {
                let petID = parseInt(pet.petID, 10);

                petmap[petID] = pet["pet_name"]
            })

            // populate examroom dropdown
            db.pool.query(examRoomDropDown, (error, rows, fields) => {

                // save exam rooms
                let exam_rooms = rows;

                let exam_roommap = {};
                exam_rooms.map(exam_room => {
                    let exam_roomID = parseInt(exam_room.exam_roomID, 10);

                    exam_roommap[exam_roomID] = exam_room["exam_roomID"];
                });

                // overwrite petID with name of pet
                appointmentData = appointmentData.map(appointment => {
                    return Object.assign(appointment, {petID: petmap[appointment.petID]})
                })

                return res.render('appointments', {appointmentData: appointmentData, pets: pets, exam_rooms: exam_rooms})
            })
        })

   })
});

// add appointment
app.post('/add-appointment-form', function(req, res)
{
    let appointmentData = req.body;

    let createAppointment = `INSERT INTO Appointments(petID, exam_roomID, appointment_date) VALUES('${appointmentData['input-petID']}', '${appointmentData['input-exam_roomID']}', '${appointmentData['input-appointment_date']}')`;

    db.pool.query(createAppointment, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/appointment-procedures');
        }
    });
});

// display procedures for add appointment
app.get('/appointment-procedures', function(req,res)
{
    let displayProcedures = "SELECT * FROM Procedures;";
    let apptPetName = "SELECT * FROM Pets WHERE PetID = 2";
    let apptInfoQuery = "SELECT * FROM Appointments ORDER BY appointmentID DESC LIMIT 1;";
    db.pool.query(displayProcedures, function(error, responseVal, fields) {
        let options = responseVal;
        console.log(options);
        db.pool.query(apptPetName, function(error, responseVal, fields) {
            let appointmentPet = responseVal;
            console.log(appointmentPet);
            db.pool.query(apptInfoQuery, function(error, responseVal, fields) {
                let apptInfo = responseVal;
                console.log(apptInfo);

                res.render('appointment-procedures', {apptInfo: apptInfo, procedureOptions: options, appointmentPet: appointmentPet});
            });
        });
    });
});

// add procedures to new appointment
app.post('/add-appointment-procedure-form', function(req, res) {
    let numProcs = parseInt(req.body.numProcText);
    let apptProcData = req.body;
    if(numProcs == 0) {
        // delete appointment
        res.redirect('/appointments');
        // return error saying there must be procedures assigned to appointment
    }
        res.redirect('/appointments');
    //let apptID = parseInt(req.body.apptID);
    let apptID = 33;
    let procIDs = [];
    for(i = 0; i < numProcs; i++) {
            procIDs.push(parseInt(apptProcData.i));
    }
    let procVals = [];
    for(i = 0; i < procIDs.length; i++) {
        procVals[i] = [apptID, procIDs[i]];
    }
    let createAppointmentProcedures = `INSERT INTO Appointment_has_Procedure(appointmentID, procedureID) VALUES ?`;
    db.pool.query(createAppointmentProcedures, [procVals], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/appointments');
        }
    });
});

// view appointment procedures
let apptProcsView; // post assigns "apptProcsView" so that get can read it and pass to handlebars

app.post('/view-appt-procs', function(req, res)
{
    let apptID = parseInt(req.body.appointmentID);
    let disApptProcs = `SELECT Procedures.procedureID, Procedures.proc_name, Procedures.cost FROM Appointment_has_Procedure JOIN Procedures ON Appointment_has_Procedure.procedureID = Procedures.procedureID WHERE Appointment_has_Procedure.appointmentID = ${apptID}`;
    db.pool.query(disApptProcs, function(error, results, fields) {
        apptProcsView = results;
        // idk where these are being sent :-) maybe ajax? waiting for response idk
        res.send(results);
    });
});

// literally just renders all the work post did
app.get('/view-appt-procs', function(req, res)
{
    res.render('view-appt-procs', {ApptProcs: apptProcsView, layout: 'blank'});
});

// update appointment

// delete appointment
app.delete('/delete-appointment', function(req, res, next) {
    let appointmentData = req.body;
    let appointmentID = parseInt(appointmentData.appointmentID);
    let deleteAppointment = 'DELETE FROM Appointments WHERE appointmentID = ?';

    db.pool.query(deleteAppointment, [appointmentID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    });
});

////////////////////////////////////// Owners Page/////////////////////////////////////////////
// display owners page
app.get('/owners', function(req,res)
{
    let displayOwners;

    if(req.query.owner_name === undefined) {
        displayOwners = "SELECT * FROM Owners;";
    }
    else {
        displayOwners = `SELECT * FROM Owners WHERE owner_name LIKE "${req.query.owner_name}%"`
    }

    db.pool.query(displayOwners, function(error, rows, fields) {
        res.render('owners', {Owner: rows});
    });
});


// Add Owner
app.post('/add-owner-form', function(req, res)
{
    let Owner = req.body;

    createOwnerQuery = `INSERT INTO Owners(owner_name, email) VALUES ('${Owner['input-owner_name']}', '${Owner['input-email']}');`;
    db.pool.query(createOwnerQuery, function(error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/owners');
        }
    });
});

// Update Owner (Doesn't work yet)
app.put('/put-owner', function(req,res,next)
{
    let Owner = req.body;

    let email = Owner.email;
    let ownerID = parseInt(Owner.ownerID);

    let queryUpdateOwnerEmail = 'UPDATE Owners SET email = ? WHERE Owners.ownerID = ?';
    //let enterEmail = 'SELECT * FROM Pet_Types WHERE pet_typeID = ?'

    db.pool.query(queryUpdateOwnerEmail, [email, ownerID], function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    });
});

////////////////////////////////////////// Pet Types Page /////////////////////////////////////////
// display pet types
app.get('/pet-types', function(req, res)
{
    let displayPetTypes = "SELECT * FROM Pet_Types;";

    db.pool.query(displayPetTypes, function(error, rows, fields) {
        res.render('pet-types', {typeData: rows});
    });
});

// Add Pet Type
app.post('/add-pet-type-form', function(req, res)
{
    let typeData = req.body;
    createPetTypeQuery = `INSERT INTO Pet_Types(type_name) VALUES ("${typeData['input-type_name']}");`;

    db.pool.query(createPetTypeQuery, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/pet-types');
        }
    });
});


//////////////////////////////////////// Veterinarians Page ////////////////////////////////////////
// display veterinarians page
app.get('/veterinarians', function(req,res)
{
    let displayVets = "SELECT * FROM Veterinarians;";

    db.pool.query(displayVets, function(error, response, fields) {
        res.render('veterinarians', {vetData: response});
    });

});

// add veterinarian
app.post('/add-vet-form', function(req, res)
{
    let vetData = req.body;
    createVetQuery = `INSERT INTO Veterinarians(vet_name) VALUES ("${vetData['input-vet_name']}");`;

    db.pool.query(createVetQuery, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/veterinarians')
        }
    });
});

// view veterinarian procedures

let vetProcsView; // POST assigns "vetProcsView" so that GET can read it and pass to handlebars

app.post('/view-vet-procs', function(req, res)
{
    let vetID = parseInt(req.body.vetID);
    let disVetProcs = `SELECT Procedures.procedureID, Procedures.proc_name, Procedures.cost FROM Procedure_has_Vet JOIN Procedures ON Procedure_has_Vet.procedureID = Procedures.procedureID WHERE Procedure_has_Vet.vetID = ${vetID}`;
    db.pool.query(disVetProcs, function(error, results, fields) {
        vetProcsView = results;
        // idk where these are being sent :-) maybe ajax? waiting for response idk
        res.send(results);
    });
});

// literally just renders all the work post did
app.get('/view-vet-procs', function(req, res)
{
    res.render('view-vet-procs', {vetProcs: vetProcsView, layout: 'blank'});
});
///////////////////////////////////////// Procedures Page ///////////////////////////////////////////
// display procedures page
app.get('/procedures', function(req,res)
{
    let displayProcedures = 'SELECT * FROM Procedures;';

    db.pool.query(displayProcedures, function(error, rows, fields) {
        res.render('procedures', {procedureData: rows});
    })
});


// add procedures
app.post('/add-procedure-form', function(req, res)
{
    let procedureData = req.body;
    let createProcedure = `INSERT INTO Procedures(proc_name, cost) VALUES ('${procedureData['input-proc_name']}', '${procedureData['input-cost']}');`;

    db.pool.query(createProcedure, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/procedures');
        }
    });
});

// update procedures
app.put('/update-procedure-form', function(req, res) {

});


/////////////////////////////////////////// Pets Page /////////////////////////////////////////////////
// Citation for following block of code:
// Date: 05/05/2022
// Adapted from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// display pets page
app.get('/pets', function(req, res)
{
    let displayPets;

    if(req.query.pet_name === undefined){
        displayPets = "SELECT * FROM Pets;";
    }
    else{
        displayPets = `SELECT * FROM Pets WHERE pet_name LIKE "${req.query.pet_name}%"`
    }

    // Populate Pet_Types dropdown
    let petsTypesDropDown = "SELECT * FROM Pet_Types;";

    // Populate Owners dropdown
    let ownersDropDown = 'SELECT * FROM Owners;';

    db.pool.query(displayPets, function(error, rows, fields){

        let pets = rows;

        // Populate dropdown query
        db.pool.query(petsTypesDropDown, (error, rows, fields) => {

            let pet_types = rows;

            // Construct an object for reference in the table
            let pet_typemap = {}
            pet_types.map(pet_type => {
                let pet_typeID = parseInt(pet_type.pet_typeID, 10);

                pet_typemap[pet_typeID] = pet_type["type_name"]
            });

            // populate owner dropdown
            db.pool.query(ownersDropDown, (error, rows, fields) => {

                let owners = rows;

                let owner_map = {}
                owners.map(owner => {
                    let ownerID = parseInt(owner.ownerID, 10);

                    owner_map[ownerID] = owner["owner_name"]
                });

                // overwrite ownerID with name of owner
                // Overwrite the pet_typeID with the name of the pet_type in the Pets object
                pets = pets.map(pet => {
                    return Object.assign(pet, {pet_typeID: pet_typemap[pet.pet_typeID]}, {ownerID: owner_map[pet.ownerID]})
                });

                return res.render('pets', {data: pets, pet_types: pet_types, owners: owners});
            })
        });
    });
});


// Delete Pet
app.delete('/delete-pet', function(req,res,next){
    let data = req.body;
    let petID = parseInt(data.petID);
    let deletePet= `DELETE FROM Pets WHERE petID = ?`;

    db.pool.query(deletePet, [petID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    });
});


// Update Pet
app.put('/put-pet', function(req,res,next){
    let data = req.body;

    let pet_typeID = parseInt(data.pet_typeID);
    let pet = parseInt(data.pet_name);

    let queryUpdatePetType = 'UPDATE Pets SET pet_typeID = ? WHERE Pets.petID = ?';
    let selectPetType = 'SELECT * FROM Pet_Types WHERE pet_typeID = ?'

    // run first query
    db.pool.query(queryUpdatePetType, [pet_typeID, pet], function(error, rows, fields){
        if(error) {

            console.log(error);
            res.sendStatus(400);
        }

        // if no error, run second query and return that data so we can use it to update
        // pets table
        else
        {
            // run second query
            db.pool.query(selectPetType, [pet_typeID], function(error, rows, fields) {

                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }

            });
        }
    });
});


// Add Pet
app.post('/add-pet-form', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let breed = data['input-breed'];
    if (breed === undefined)
    {
        breed = 'NULL'
    }

    query1 = `INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate) VALUES ('${data['input-pet_name']}', '${data['input-ownerID']}', '${data['input-pet_typeID']}', ${breed}, '${data['input-birthdate']}');`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/pets');
        }
    });
});

/*
    LISTENER
*/

app.listen(PORT, function(){
    console.log('Express started on http://localhost: ' + PORT + '; press Ctrl-C to terminate.')
});