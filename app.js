// App.js


/*
    SETUP
*/

// Express
var express = require('express');
var app     = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT        = 50688;

// Database
var db = require('./database/db-connector');

// Handlebars

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));

/*
    ROUTES
*/

// Home Page
app.get('/', function(req,res)
{
    res.render('index');
});

// Apointments Page
app.get('/appointments', function(req,res)
{
    res.render('appointments');
});

// Owners Page
app.get('/owners', function(req,res)
{
    //res.render('owners');
       // Populate Owners table
       let query1;

       // If there is no query string, we just perform a basic SELECT
       if(req.query.owner_name === undefined)
       {
           query1 = "SELECT * FROM Owners;";
       }

       // If there is a query string, we assume this is a search
       else
       {
           query1 = `SELECT * FROM Owners WHERE owner_name LIKE "${req.query.owner_name}%"`
       }

       db.pool.query(query1, function(error, rows, fields){

           // Save the owners
           let owners = rows;
            return res.render('owners', {data: owners});
        })
});


// Add Owner
app.post('/add-owner-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Owners(owner_name, email) VALUES ('${data['input-owner_name']}', '${data['input-email']}');`;
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
            res.redirect('/owners');
        }
    });
});

// Pet Types Page
app.get('/pet-types', function(req, res)
{
    res.render('pet-types');
});

// Veterinarians Page
app.get('/veterinarians', function(req,res)
{
    res.render('veterinarians');
});

// Procedures Page
app.get('/procedures', function(req,res)
{
    res.render('procedures');
});

// Appointments Page
app.get('/appointments', function(req,res)
{
    res.render('appointments');
});

// Pets Page
app.get('/pets', function(req, res)
{
    // Populate Pets table
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if(req.query.pet_name === undefined)
    {
        query1 = "SELECT * FROM Pets;";
    }

    // If there is a query string, we assume this is a search
    else
    {
        query1 = `SELECT * FROM Pets WHERE pet_name LIKE "${req.query.pet_name}%"`
    }

    // Populate Pet_Types dropdown
    let query2 = "SELECT * FROM Pet_Types;";

    // Populate Owners dropdown
    let query3 = 'SELECT * FROM Owners;';

    db.pool.query(query1, function(error, rows, fields){

        // Save the pets
        let pets = rows;

        // Populate dropdown query
        db.pool.query(query2, (error, rows, fields) => {

            // Save pet_types
            let pet_types = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let pet_typemap = {}
            pet_types.map(pet_type => {
                let pet_typeID = parseInt(pet_type.pet_typeID, 10);

                pet_typemap[pet_typeID] = pet_type["type_name"]
            })

            // populate owner dropdown
            db.pool.query(query3, (error, rows, fields) => {

                // save owners
                let owners = rows;

                let owner_map = {}
                owners.map(owner => {
                    let ownerID = parseInt(owner.ownerID, 10);

                    owner_map[ownerID] = owner["owner_name"]
                })

                // overwrite ownerID with name of owner
            // Overwrite the pet_typeID with the name of the pet_type in the Pets object
                pets = pets.map(pet => {
                    return Object.assign(pet, {pet_typeID: pet_typemap[pet.pet_typeID]}, {ownerID: owner_map[pet.ownerID]})
                })

                return res.render('pets', {data: pets, pet_types: pet_types, owners: owners});
            })
        });
    });                                    // Render the index.hbs file, and also send the renderer
                                        // an object where 'data' is equal to the 'rows' we
});                                     // recieve back from the query


// Delete Pet
app.delete('/delete-pet', function(req,res,next){
    let data = req.body;
    let petID = parseInt(data.petID);
   // let deleteCert_Pet = 'DELETE FROM Pets WHERE petID = ?';
    let deletePet= `DELETE FROM Pets WHERE petID = ?`;

    db.pool.query(deletePet, [petID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
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

            })
        }
    })
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
    })
})

/*
    LISTENER
*/

app.listen(PORT, function(){
    console.log('Express started on http://localhost: ' + PORT + '; press Ctrl-C to terminate.')
});