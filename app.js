// App.js


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
const res = require('express/lib/response');
app.engine('.hbs', engine({
    extname: ".hbs",
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

// display procedures for appointment
app.get('/appointment-procedures', function(req,res)
{
    let displayProcedures = "SELECT * FROM Procedures;";
    let apptPetName = "SELECT * FROM Pets WHERE PetID = 2";
    let apptInfoQuery = "SELECT * FROM Appointments ORDER BY appointmentID DESC LIMIT 1;";
    db.pool.query(displayProcedures, function(error, responseVal, fields) {
        let options = responseVal;
        db.pool.query(apptPetName, function(error, responseVal, fields) {
            let appointmentPet = responseVal;
            db.pool.query(apptInfoQuery, function(error, responseVal, fields) {
                let apptInfo = responseVal;

                res.render('appointment-procedures', {apptInfo: apptInfo, procedureOptions: options, appointmentPet: appointmentPet});
            });
        });
    });
});

// add procedures to appointment
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

app.get('/display-appt-proc', function(req, res) {
    let apptID = parseInt(req.body.appointmentID);

    let disApptProcs = `SELECT Procedures.proc_name FROM Appointment_has_Procedure JOIN Procedures ON Appointment_has_Procedure.procedureID = Procedures.procedureID WHERE Appointment_has_Procedure.appointmentID = ${apptID}`;
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

///////////////////////////////////////// Procedures Page ///////////////////////////////////////////
// display procedures page
app.get('/procedures', function(req,res)
{
    let displayProcedures = 'SELECT * FROM Procedures;';

    db.pool.query(displayProcedures, function(error, rows, fields) {
        res.render('procedures', {procedureData: rows});
    })
});

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

        // Save the pets
        let pets = rows;

        // Populate dropdown query
        db.pool.query(petsTypesDropDown, (error, rows, fields) => {

            // Save pet_types
            let pet_types = rows;

            // Construct an object for reference in the table
            let pet_typemap = {}
            pet_types.map(pet_type => {
                let pet_typeID = parseInt(pet_type.pet_typeID, 10);

                pet_typemap[pet_typeID] = pet_type["type_name"]
            });

            // populate owner dropdown
            db.pool.query(ownersDropDown, (error, rows, fields) => {

                // save owners
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
app.post('/add-pet-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let breed = parseInt(data['input-breed']);
    if (isNaN(breed))
    {
        breed = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate) VALUES ('${data['input-pet_name']}', '${data['input-ownerID']}', '${data['input-pet_typeID']}', ${breed}, '${data['input-birthdate']}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we direct back to our root route, which automatically runs the SELECT * FROM Pets
        // and presents it on the screen
        else
        {
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