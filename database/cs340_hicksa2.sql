-- phpMyAdmin SQL Dump
-- version 5.1.3-2.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 13, 2022 at 11:56 PM
-- Server version: 10.6.7-MariaDB-log
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_hicksa2`
--

-- --------------------------------------------------------

--
-- Table structure for table `Appointments`
--

CREATE TABLE `Appointments` (
  `appointmentID` int(11) NOT NULL,
  `petID` int(11) NOT NULL,
  `exam_roomID` tinyint(3) NOT NULL,
  `appointment_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Appointments`
--

INSERT INTO `Appointments` (`appointmentID`, `petID`, `exam_roomID`, `appointment_date`) VALUES
(1, 2, 1, '2022-04-26'),
(2, 3, 2, '2022-04-26'),
(3, 4, 3, '2022-04-26');

-- --------------------------------------------------------

--
-- Table structure for table `Appointment_has_Procedure`
--

CREATE TABLE `Appointment_has_Procedure` (
  `appointmentID` int(11) DEFAULT NULL,
  `procedureID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Appointment_has_Procedure`
--

INSERT INTO `Appointment_has_Procedure` (`appointmentID`, `procedureID`) VALUES
(1, 4),
(1, 3),
(2, 5),
(3, 1),
(3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Exam_Rooms`
--

CREATE TABLE `Exam_Rooms` (
  `exam_roomID` tinyint(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Exam_Rooms`
--

INSERT INTO `Exam_Rooms` (`exam_roomID`) VALUES
(1),
(2),
(3);

-- --------------------------------------------------------

--
-- Table structure for table `Owners`
--

CREATE TABLE `Owners` (
  `ownerID` int(11) NOT NULL,
  `owner_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Owners`
--

INSERT INTO `Owners` (`ownerID`, `owner_name`, `email`) VALUES
(1, 'Robert McGee', 'rmcgee12@email.com'),
(2, 'Ankur Manz', 'ankurmanz@email.com'),
(3, 'Reko Velasco', 'rvelasco@email.com'),
(4, 'Eliana Randall', 'elrandall23@email.com'),
(5, 'Vina Rosenfeld', 'vinarosenfeld@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `Pets`
--

CREATE TABLE `Pets` (
  `petID` int(11) NOT NULL,
  `pet_name` varchar(50) NOT NULL,
  `ownerID` int(11) NOT NULL,
  `pet_typeID` int(11) NOT NULL,
  `breed` varchar(50) DEFAULT NULL,
  `birthdate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Pets`
--

INSERT INTO `Pets` (`petID`, `pet_name`, `ownerID`, `pet_typeID`, `breed`, `birthdate`) VALUES
(1, 'Sunday', 1, 2, 'Domestic Shorthair', '2020-04-15'),
(2, 'Knox', 2, 2, 'Main Coon', '2015-09-23'),
(3, 'Chelsea', 3, 1, 'Great Dane', '2018-06-23'),
(4, 'Pico de Gallo', 4, 3, NULL, '2021-07-01'),
(5, 'Snickers', 5, 1, 'Pomeranian', '2012-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `Pet_Types`
--

CREATE TABLE `Pet_Types` (
  `pet_typeID` int(11) NOT NULL,
  `type_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Pet_Types`
--

INSERT INTO `Pet_Types` (`pet_typeID`, `type_name`) VALUES
(1, 'Dog'),
(2, 'Cat'),
(3, 'Rat'),
(4, 'Rabbit');

-- --------------------------------------------------------

--
-- Table structure for table `Procedures`
--

CREATE TABLE `Procedures` (
  `procedureID` int(11) NOT NULL,
  `proc_name` varchar(50) NOT NULL,
  `cost` decimal(19,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Procedures`
--

INSERT INTO `Procedures` (`procedureID`, `proc_name`, `cost`) VALUES
(1, 'neuter', '10.00'),
(2, 'spay', '10.00'),
(3, 'vaccinate', '15.00'),
(4, 'wellness exam', '50.00'),
(5, 'sick exam', '50.00');

-- --------------------------------------------------------

--
-- Table structure for table `Procedure_has_Vet`
--

CREATE TABLE `Procedure_has_Vet` (
  `procedureID` int(11) DEFAULT NULL,
  `vetID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Procedure_has_Vet`
--

INSERT INTO `Procedure_has_Vet` (`procedureID`, `vetID`) VALUES
(4, 2),
(4, 3),
(5, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Veterinarians`
--

CREATE TABLE `Veterinarians` (
  `vetID` int(11) NOT NULL,
  `vet_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Veterinarians`
--

INSERT INTO `Veterinarians` (`vetID`, `vet_name`) VALUES
(1, 'Sara Robinson'),
(2, 'Evan Johnson'),
(3, 'Mary Smith'),
(4, 'Greg Williams');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Appointments`
--
ALTER TABLE `Appointments`
  ADD PRIMARY KEY (`appointmentID`),
  ADD KEY `petID` (`petID`),
  ADD KEY `exam_roomID` (`exam_roomID`);

--
-- Indexes for table `Appointment_has_Procedure`
--
ALTER TABLE `Appointment_has_Procedure`
  ADD KEY `appointmentID` (`appointmentID`),
  ADD KEY `procedureID` (`procedureID`);

--
-- Indexes for table `Exam_Rooms`
--
ALTER TABLE `Exam_Rooms`
  ADD PRIMARY KEY (`exam_roomID`);

--
-- Indexes for table `Owners`
--
ALTER TABLE `Owners`
  ADD PRIMARY KEY (`ownerID`);

--
-- Indexes for table `Pets`
--
ALTER TABLE `Pets`
  ADD PRIMARY KEY (`petID`),
  ADD KEY `ownerID` (`ownerID`),
  ADD KEY `pet_typeID` (`pet_typeID`);

--
-- Indexes for table `Pet_Types`
--
ALTER TABLE `Pet_Types`
  ADD PRIMARY KEY (`pet_typeID`);

--
-- Indexes for table `Procedures`
--
ALTER TABLE `Procedures`
  ADD PRIMARY KEY (`procedureID`);

--
-- Indexes for table `Procedure_has_Vet`
--
ALTER TABLE `Procedure_has_Vet`
  ADD KEY `procedureID` (`procedureID`),
  ADD KEY `vetID` (`vetID`);

--
-- Indexes for table `Veterinarians`
--
ALTER TABLE `Veterinarians`
  ADD PRIMARY KEY (`vetID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Appointments`
--
ALTER TABLE `Appointments`
  MODIFY `appointmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Owners`
--
ALTER TABLE `Owners`
  MODIFY `ownerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Pets`
--
ALTER TABLE `Pets`
  MODIFY `petID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Pet_Types`
--
ALTER TABLE `Pet_Types`
  MODIFY `pet_typeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Procedures`
--
ALTER TABLE `Procedures`
  MODIFY `procedureID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Veterinarians`
--
ALTER TABLE `Veterinarians`
  MODIFY `vetID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Appointments`
--
ALTER TABLE `Appointments`
  ADD CONSTRAINT `Appointments_ibfk_1` FOREIGN KEY (`petID`) REFERENCES `Pets` (`petID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Appointments_ibfk_2` FOREIGN KEY (`exam_roomID`) REFERENCES `Exam_Rooms` (`exam_roomID`);

--
-- Constraints for table `Appointment_has_Procedure`
--
ALTER TABLE `Appointment_has_Procedure`
  ADD CONSTRAINT `Appointment_has_Procedure_ibfk_1` FOREIGN KEY (`appointmentID`) REFERENCES `Appointments` (`appointmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Appointment_has_Procedure_ibfk_2` FOREIGN KEY (`procedureID`) REFERENCES `Procedures` (`procedureID`);

--
-- Constraints for table `Pets`
--
ALTER TABLE `Pets`
  ADD CONSTRAINT `Pets_ibfk_1` FOREIGN KEY (`ownerID`) REFERENCES `Owners` (`ownerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Pets_ibfk_2` FOREIGN KEY (`pet_typeID`) REFERENCES `Pet_Types` (`pet_typeID`) ON DELETE CASCADE;

--
-- Constraints for table `Procedure_has_Vet`
--
ALTER TABLE `Procedure_has_Vet`
  ADD CONSTRAINT `Procedure_has_Vet_ibfk_1` FOREIGN KEY (`procedureID`) REFERENCES `Procedures` (`procedureID`),
  ADD CONSTRAINT `Procedure_has_Vet_ibfk_2` FOREIGN KEY (`vetID`) REFERENCES `Veterinarians` (`vetID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
