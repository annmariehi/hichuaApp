-- display all Pets data for Pets Table
SELECT * FROM Pets;

-- display all Pet_Types data for Pet_Types Table
SELECT * FROM Pet_Types;

-- display all Owners data for Owners Table
SELECT * FROM Owners;

-- display all Veterinarians data for Veterinarians Table
SELECT * FROM Veterinarians;

-- display all Procedures data for Procedures Table
SELECT * FROM Procedures;

-- display all Appointments data for Appointments Table
SELECT * FROM Appointments;

-- Add a new pet
INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate)
VALUES (:pet_name, :ownerID, :pet_typeID, :breed, :birthdate);

-- Add a new pet type to Pet_Types
INSERT INTO Pet_Types(type_name)
VALUES (:input-type_name);

-- Add a new veterinarian to Veterinarians
INSERT INTO Veterinarians(vet_name)
VALUES (:input-vet_name);

-- Add a new procedure to Procedures
INSERT INTO Procedures(proc_name, cost)
VALUES (:input-proc_name, :input-cost);

-- Add a new exam room to Exam_Rooms
INSERT INTO Exam_Rooms(exam_roomID)
VALUES (:input-exam_roomID);

-- Add a new owner to Owners
INSERT INTO Owners(owner_name, email)
VALUES (:input-owner_name, :input-email);

-- Add a new appointment to Appointments
INSERT INTO Appointments(petID, exam_roomID, appointment_date)
VALUES (:input-petID, :input-exam_roomID, :input-appointment_date);

-- Delete appointment from Appointments
DELETE FROM Appointments WHERE appointmentID = :appoitnmentID_selected_from_browse_appointments_page

-- Delete pet from Pets
DELETE FROM Pets WHERE petID = :petID_selected_from_browse_pets_page

-- update Owner's email in Owners table
UPDATE Owners SET email = :input-email-update WHERE Owners.ownerID = :input-ownerID;

--


-- get a single pet's data for the Update Pet's form
SELECT petID, pet_name, ownerID, pet_typeID, breed, birthdate
FROM Pets WHERE petID = :petID_selected_from_browse_pet_page

-- get a single pet's data for the Update Veterinarian's form
SELECT vetID, vet_name
FROM Veterinarians WHERE vetID = :vetID_selected_from_browse_pet_type_page

-- get a single pet type's data for the Update Pet Type's form
SELECT pet_typeID, type_name
FROM Pet_Types WHERE ownerID = :pet_typeID_selected_from_browse_pet_type_page

-- get a single owner's data for the Update Owner's form
SELECT ownerID, owner_name, email
FROM Owners WHERE ownerID = :ownerID_selected_from_browse_owners_page

-- get a single pet type's data for the Update Pet Type's form
SELECT exam_roomID
FROM Exam_Rooms WHERE exam_roomID = :exam_roomID_selected_from_browse_exam_room_page





INSERT INTO Appointment_has_Procedure(appointmentID, procedureID)
VALUES (:appoitnmentID, :procedureID)


INSERT INTO Procedure_has_Vet(procedureID, vetID)
VALUES (:procedureID, :vetID)




