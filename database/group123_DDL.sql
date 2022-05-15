SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

-- ------------------------------------------------------------
-- Table structure and data insert for 'Owners'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Owners (
	ownerID int AUTO_INCREMENT NOT NULL,
    owner_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    PRIMARY KEY (ownerID)
);

INSERT INTO Owners(owner_name, email)
VALUES ("Robert McGee", "rmcgee12@email.com"),
("Ankur Manz", "ankurmanz@email.com"),
("Reko Velasco", "rvelasco@email.com"),
("Eliana Randall", "elrandall23@email.com"),
("Vina Rosenfeld", "vinarosenfeld@email.com");

-- ------------------------------------------------------------
-- Table structure and data insert for 'Pet_Types'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Pet_Types (
	pet_typeID int AUTO_INCREMENT NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (pet_typeID)
);

INSERT INTO Pet_Types(type_name)
VALUES ("Dog"),
("Cat"),
("Rat"),
("Rabbit");
-- ------------------------------------------------------------
-- Table structure and data insert for 'Pets'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Pets (
	petID int AUTO_INCREMENT NOT NULL,
    pet_name VARCHAR(50) NOT NULL,
    ownerID INT NOT NULL,
    pet_typeID INT NOT NULL,
    breed VARCHAR(50),
    birthdate DATE NOT NULL,
    PRIMARY KEY (petID),
    FOREIGN KEY (ownerID) REFERENCES Owners(ownerID) ON DELETE CASCADE,
    FOREIGN KEY (pet_typeID) REFERENCES Pet_Types(pet_typeID) ON DELETE CASCADE
);

INSERT INTO Pets(pet_name, ownerID, pet_typeID, breed, birthdate)
VALUES ("Sunday", 1, 2, "Domestic Shorthair", "2020-04-15"),
("Knox", 2, 2, "Main Coon", "2015-09-23"),
("Chelsea", 3, 1, "Great Dane", "2018-06-23"),
("Pico de Gallo", 4, 3, NULL, "2021-07-01"),
("Snickers", 5, 1, "Pomeranian", "2012-03-01");

-- ------------------------------------------------------------
-- Table structure and data insert for 'Veterinarians'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Veterinarians (
	vetID int AUTO_INCREMENT NOT NULL,
    vet_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (vetID)
);

INSERT INTO Veterinarians(vet_name)
VALUES ("Sara Robinson"),
("Evan Johnson"),
("Mary Smith"),
("Greg Williams");

-- ------------------------------------------------------------
-- Table structure and data insert for 'Procedures'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Procedures (
	procedureID int AUTO_INCREMENT NOT NULL,
    proc_name VARCHAR(50) NOT NULL,
    cost DECIMAL(19,2) NOT NULL,
    PRIMARY KEY(procedureID)
);

INSERT INTO Procedures(proc_name, cost)
VALUES ("neuter", 10.00),
("spay", 10.00),
("vaccinate", 15.00),
("wellness exam", 50.00),
("sick exam", 50.00);

-- ------------------------------------------------------------
-- Table structure and data insert for 'Exam_Rooms'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Exam_Rooms (
	exam_roomID TINYINT(3) NOT NULL,
    PRIMARY KEY(exam_roomID)
);

INSERT INTO Exam_Rooms(exam_roomID)
VALUES (1),
(2),
(3);

-- ------------------------------------------------------------
-- Table structure and data insert for 'Appointments'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Appointments (
	appointmentID int AUTO_INCREMENT NOT NULL,
    petID int NOT NULL,
    exam_roomID tinyint(3) NOT NULL,
    appointment_date DATE NOT NULL,
    PRIMARY KEY (appointmentID),
    FOREIGN KEY (petID) REFERENCES Pets(petID) ON DELETE CASCADE,
    FOREIGN KEY (exam_roomID) REFERENCES Exam_Rooms(exam_roomID)
);

INSERT INTO Appointments(petID, exam_roomID, appointment_date)
VALUES (2, 1, "2022-04-26"),
(3, 2, "2022-04-26"),
(4, 3, "2022-04-26");

-- ------------------------------------------------------------
-- Table structure and data insert for 'Appointment_has_Procedure'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Appointment_has_Procedure (
	appointmentID int,
    procedureID int,
    FOREIGN KEY (appointmentID) REFERENCES Appointments(appointmentID) ON DELETE CASCADE,
    FOREIGN KEY (procedureID) REFERENCES Procedures(procedureID)
);

INSERT INTO Appointment_has_Procedure(appointmentID, procedureID)
VALUES (1, 4),
(1, 3),
(2, 5),
(3, 1),
(3, 3);

-- ------------------------------------------------------------
-- Table structure and data insert for 'Procedure_has_Vet'
-- ------------------------------------------------------------
CREATE OR REPLACE TABLE Procedure_has_Vet (
	procedureID int,
    vetID int,
    FOREIGN KEY (procedureID) REFERENCES Procedures(procedureID),
    FOREIGN KEY (vetID) REFERENCES Veterinarians(vetID) ON DELETE CASCADE
);

INSERT INTO Procedure_has_Vet(procedureID, vetID)
VALUES (4, 2),
(4, 3),
(5, 1),
(3, 2);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;