-------------------------------------------------------------------
-- Pets Page
-------------------------------------------------------------------
-- display Pets
SELECT * FROM Pets;

-- add Pets
INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate)
VALUES (:input-pet_name, :input-ownerID, :input-pet_typeID, :input-breed, :input-birthdate);

-- delete Pets
DELETE FROM Pets WHERE petID = :input-petID;

-------------------------------------------------------------------
-- Pet_Types Page
-------------------------------------------------------------------
-- display Pet_Types
SELECT * FROM Pet_Types;

-- add Pet_Types
INSERT INTO Pet_Types(type_name)
VALUES (:input-type_name);

-------------------------------------------------------------------
-- Owners Page
-------------------------------------------------------------------
-- display Owners
SELECT * FROM Owners;

-- add Owners
INSERT INTO Owners(owner_name, email)
VALUES (:input-owner_name, :input-email);

-- update Owners
UPDATE Owners SET email = :input-email_update
WHERE Owners.ownerID = :input-ownerID;

-------------------------------------------------------------------
-- Veterinarians Page
-------------------------------------------------------------------
-- display Veterinarians
SELECT * FROM Veterinarians;

-- display Veterinarian Procedures from Procedure_has_Vet
SELECT ProcedureID FROM Procedure_has_Vet
WHERE vetID =:input-vetID;

-- add Veterinarians
INSERT INTO Veterinarians(vet_name)
VALUES (:input-vet_name);

-- add Procedures to Veterinarians with Procedure_has_Vet
INSERT INTO Procedure_has_Vet(procedureID, vetID)
VALUES (:input-procedureID, :input-vetID);

-------------------------------------------------------------------
-- Procedures Page
-------------------------------------------------------------------
-- display Procedures
SELECT * FROM Procedures;

-- add Procedures
INSERT INTO Procedures(proc_name, cost)
VALUES (:input-proc_name, :input-cost);

-------------------------------------------------------------------
-- Appointments Page
-------------------------------------------------------------------
-- display Appointments
SELECT * FROM Appointments;

-- display Appointment Procedures from Appointment_has_Procedure
SELECT procedureID FROM Appointment_has_Procedure
WHERE appointmentID = :input-appoitmentID;

-- add Appointments
INSERT INTO Appointments(petID, exam_roomID, appointment_date)
VALUES (:input-petID, :input-exam_roomID, :input-appointment_date);

-- add Procedures to Appointments with Appointment_has_Procedure
INSERT INTO Appointment_has_Procedure(appointmentID, procedureID)
VALUES (:input-appointmentID, :input-procedureID);

-- update Appointments
UPDATE Appointments SET exam_roomID =:input-exam_roomID_update, appointment_date =:input-appointment_date_update
WHERE appointmentID = :input-appointmentID;

-- update Appointment Procedures in Appointment_has_Procedure
UPDATE Appointment_has_Procedure SET procedureID =:input-procedureID_update
WHERE appointmentID =:input-appointmentID;

-- delete Appointments
DELETE FROM Appointments WHERE appointmentID = :input-appoitnmentID;

-------------------------------------------------------------------
-- Exam_Rooms Page
-------------------------------------------------------------------
-- display all Exam_Rooms data for Exam_Rooms Table
SELECT * FROM Exam_Rooms;

-- add a new exam room to Exam_Rooms
INSERT INTO Exam_Rooms(exam_roomID)
VALUES (:input-exam_roomID);