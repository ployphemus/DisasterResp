-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2024 at 06:05 AM
-- Server version: 10.11.7-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodemysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `disasterzones`
--

DROP TABLE IF EXISTS `disasterzones`;
CREATE TABLE `disasterzones` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Radius` decimal(9,6) DEFAULT NULL,
  `HexColor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disasterzones`
--

INSERT INTO `disasterzones` (`id`, `Name`, `Latitude`, `Longitude`, `Radius`, `HexColor`) VALUES
(13, 'test1', 36.067748, -79.794531, 6.453000, '40a3b0'),
(14, 'HP', 35.980295, -80.018116, 6.400000, '5add74'),
(15, 'Graham - Test', 36.065528, -79.438848, 4.320000, 'c2bd1e'),
(16, 'Julian - Test', 35.921084, -79.658575, 3.124000, 'ff6b6b'),
(17, 'Asheboro - T', 35.689373, -79.817281, 4.342000, 'ffda24'),
(18, 'Lexington - T', 35.825696, -80.253543, 2.430000, '9e4ba0');

-- --------------------------------------------------------

--
-- Table structure for table `earthquakes`
--

DROP TABLE IF EXISTS `earthquakes`;
CREATE TABLE `earthquakes` (
  `id` int(11) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Magnitude` decimal(4,2) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fires`
--

DROP TABLE IF EXISTS `fires`;
CREATE TABLE `fires` (
  `id` int(11) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Temperature` decimal(6,2) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `floods`
--

DROP TABLE IF EXISTS `floods`;
CREATE TABLE `floods` (
  `id` int(11) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Water_Level` decimal(5,2) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hurricanes`
--

DROP TABLE IF EXISTS `hurricanes`;
CREATE TABLE `hurricanes` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Category` enum('1','2','3','4','5') DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Wind` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landslides`
--

DROP TABLE IF EXISTS `landslides`;
CREATE TABLE `landslides` (
  `id` int(11) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `Message` text DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `disasterzone_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `Message`, `admin_id`, `disasterzone_id`) VALUES
(1, 'Test Message', 3, 18);

-- --------------------------------------------------------

--
-- Table structure for table `notification_users`
--

DROP TABLE IF EXISTS `notification_users`;
CREATE TABLE `notification_users` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_users`
--

INSERT INTO `notification_users` (`notification_id`, `user_id`) VALUES
(1, 2),
(1, 3),
(1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `shelters`
--

DROP TABLE IF EXISTS `shelters`;
CREATE TABLE `shelters` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Shelter_address` varchar(255) DEFAULT NULL,
  `Maximum_Capacity` int(11) DEFAULT NULL,
  `Current_Capacity` int(11) DEFAULT NULL,
  `disasterzone_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shelters`
--

INSERT INTO `shelters` (`id`, `Name`, `Latitude`, `Longitude`, `Shelter_address`, `Maximum_Capacity`, `Current_Capacity`, `disasterzone_id`) VALUES
(1, 'Guilford Technical Community College', 35.998152, -79.919163, '601 East Main Street, Jamestown', 300, 0, 14),
(2, 'T. Wingate Andrews High School', 35.984950, -79.989781, '1920 McGuinn Drive, High Point', 300, 0, 14),
(3, 'High Point Central High School', 35.957044, -80.021228, '801 Ferndale Boulevard, High Point', 300, 0, 14),
(4, 'Westchester Country Day School', 35.973685, -80.088716, '2045 North Old Greensboro Road, High Point', 300, 0, 14),
(5, 'Southwest Guilford High School', 36.046812, -79.988868, '4364 Barrow Road, High Point', 300, 0, 14),
(6, 'High Point Christian Academy', 35.950522, -80.024411, '307 Rotary Drive, High Point', 300, 0, 14),
(7, 'Ragsdale High School', 35.994275, -79.916551, '1000 Lucy Ragsdale Drive, Jamestown', 300, 0, 14),
(8, 'Allen Jay Elementary School', 35.932272, -79.955463, '1311 East Springfield Road, High Point', 300, 0, 14),
(9, 'Ferndale Guilford Middle School', 35.957075, -80.016829, '701 Ferndale Boulevard, High Point', 300, 0, 14),
(10, 'Jamestown Middle School', 35.986344, -79.911672, '301 Haynes Road, Jamestown', 300, 0, 14),
(11, 'Pruette Scale School', 35.954376, -80.015846, '900 West English Road, High Point', 300, 0, 14),
(12, 'Oak View Elementary School', 36.000402, -80.016072, '614 Oakview Road, High Point', 300, 0, 14),
(13, 'Shadybrook Elementary School', 36.004093, -80.025753, '503 Shadybrook Road, High Point', 300, 0, 14),
(14, 'Triangle Lake Montessori School', 35.955756, -79.972436, '2401 Triangle Lake Road, High Point', 300, 0, 14),
(15, 'Phoenix Academy', 36.046395, -79.960109, '4020 Meeting Way, High Point', 300, 0, 14),
(16, 'Children\'s Ministries Weekday', 35.954421, -80.030360, '1225 Chestnut Drive, High Point', 300, 0, 14),
(17, 'Immaculate Heart of Mary Catholic School', 36.034753, -80.020233, '4145 Johnson Street, High Point', 300, 0, 14),
(18, 'The Nest Schools High Point - Northgate', 36.004960, -80.039719, '100 Northgate Court, High Point', 300, 0, 14),
(19, 'Ledford Middle School', 35.947652, -80.120161, '3954 North Carolina 109, Thomasville', 300, 0, 14),
(20, 'High Point KinderCare', 36.032526, -79.972133, '1574 Skeet Club Road, High Point', 300, 0, 14),
(21, 'Walter M. Williams High School', 36.088445, -79.453166, '1307 South Church Street, Burlington', 300, 0, 15),
(22, 'Burlington Christian Academy', 36.082774, -79.439771, '621 East 6th Street #6501, Burlington', 300, 0, 15),
(23, 'River Mill Academy', 36.043720, -79.393444, '235 Cheeks Lane, Graham', 300, 0, 15),
(24, 'Turrentine Middle School', 36.090995, -79.463027, '1710 Edgewood Avenue, Burlington', 300, 0, 15),
(25, 'Hugh M Cummings High School', 36.088639, -79.396654, '2200 North Mebane Street, Burlington', 300, 0, 15),
(26, 'Graham High School', 36.075434, -79.382929, '903 Trollinger Road, Graham', 300, 0, 15),
(27, 'Elon University School of Health Sciences', 36.107154, -79.488584, '400 North O\'Kelly Avenue, Elon', 300, 0, 15),
(28, 'Lucius Wilson Guitar & Bass', 36.086293, -79.451776, '1336 South Church Street, Burlington', 300, 0, 15),
(29, 'Kool Kidz Place', 36.075860, -79.415205, '1824 East Webb Avenue, Burlington', 300, 0, 15),
(30, 'Emma L. Broady Academy', 36.070733, -79.465626, '2505 South Mebane Street, Burlington', 300, 0, 15),
(31, 'Music Mania/Big Jerm Drums', 36.091873, -79.435498, '293 East Front Street, Burlington', 300, 0, 15),
(32, 'Front Street Playschool', 36.096486, -79.438661, '136 South Fisher Street, Burlington', 300, 0, 15),
(33, 'Dewey Brown\'s Music & Lessons', 36.050793, -79.399166, '1017 South Main Street, Graham', 300, 0, 15),
(34, 'Ray Street Academy', 36.061652, -79.395209, '609 Ray Street, Graham', 300, 0, 15),
(35, 'Graham Middle School', 36.065951, -79.394795, '311 East Pine Street, Graham', 300, 0, 15),
(36, 'Lawson\'s Preschool', 36.079097, -79.405732, '810 North Main Street, Graham', 300, 0, 15),
(37, 'Broadview Middle School', 36.087417, -79.397387, '2229 Broadview Drive, Burlington', 300, 0, 15),
(38, 'Mathnasium', 36.081509, -79.506168, '3253 South Church Street, Burlington', 300, 0, 15),
(39, 'The Burlington School', 36.101293, -79.468325, '1615 Greenwood Terrace, Burlington', 300, 0, 15),
(40, 'Veritas Classes', 36.113667, -79.480869, '1600 Power Line Road, Elon', 300, 0, 15),
(41, 'North Asheboro Middle School', 35.744193, -79.822661, '1861 North Asheboro School Road, Asheboro', 300, 0, 17),
(42, 'Asheboro High School', 35.689770, -79.818643, '1221 South Park Street, Asheboro', 300, 0, 17),
(43, 'Noah\'s Ark Playschool', 35.696494, -79.840502, '2012 Old Farmer Road, Asheboro', 300, 0, 17),
(44, 'Southmont Elementary School', 35.648037, -79.849274, '2497 Southmont School Rd, Asheboro', 300, 0, 17),
(45, 'North Asheboro Head Start', 35.746016, -79.805024, '118 Virginia Avenue, Asheboro', 300, 0, 17),
(46, 'Early Childhood Center', 35.746265, -79.806519, '103 Virginia Avenue, Asheboro', 300, 0, 17),
(47, 'Uwharrie Charter Academy - Elementary School', 35.630164, -79.829288, '207C Eagle Lane, Asheboro', 300, 0, 17),
(48, 'Central Methodist Day School', 35.702781, -79.810895, '300 South Main Street, Asheboro', 300, 0, 17),
(49, 'Randolph Early College High School', 35.672154, -79.828198, '629 Industrial Park Avenue, Asheboro', 300, 0, 17),
(50, 'Fayetteville Street Christian', 35.716899, -79.814667, '151 West Pritchard Street, Asheboro', 300, 0, 17),
(51, 'Guy B Teachey Elementary School', 35.673183, -79.808911, '294 Newbern Avenue, Asheboro', 300, 0, 17),
(52, 'Lindley Park Elementary School', 35.701654, -79.807086, '312 Cliff Road, Asheboro', 300, 0, 17),
(53, 'Building Blocks Christian Academy', 35.732345, -79.807316, '1410 North Fayetteville Street, Asheboro', 300, 0, 17),
(54, 'Donna Lee Loflin School', 35.701711, -79.819592, '405 South Park Street, Asheboro', 300, 0, 17),
(55, 'Shepherd\'s Way Day School', 35.660858, -79.788589, '1346 Old Cox Road, Asheboro', 300, 0, 17),
(56, 'Charles W. McCrary Elementary School', 35.712818, -79.818029, '400 Ross Street, Asheboro', 300, 0, 17),
(57, 'Precious Memories Pre-School', 35.707293, -79.808574, '309 East Salisbury Street, Asheboro', 300, 0, 17),
(58, 'South Asheboro Middle School', 35.689693, -79.821762, '523 West Walker Avenue, Asheboro', 300, 0, 17),
(59, 'Asheboro City Schools Administration', 35.692182, -79.821426, '1126 South Park Street, Asheboro', 300, 0, 17),
(60, 'Beacon Child Development Center For Autism', 35.691260, -79.823809, '616 Albemarle Road, Asheboro', 300, 0, 17),
(61, 'Lexington High School', 35.833336, -80.248596, '26 Penry Street, Lexington', 300, 0, 18),
(62, 'Lexington Middle School', 35.833543, -80.245621, '100 West Hemstead Street, Lexington', 300, 0, 18),
(63, 'Lexington Aquatic Park', 35.828321, -80.276638, '207 Forest Rose Drive, Lexington', 300, 0, 18),
(64, 'Sheets Memorial Christian School', 35.810149, -80.261172, '307 Holt Street, Lexington', 300, 0, 18),
(65, 'Charles England Elementary School', 35.817208, -80.239195, '111 Cornelia Street, Lexington', 300, 0, 18),
(66, 'Pickett Elementary School', 35.845759, -80.264832, '200 Biesecker Road, Lexington', 300, 0, 18),
(67, 'Southwest Elementary School', 35.817880, -80.280436, '434 Central Avenue, Lexington', 300, 0, 18),
(68, 'Lexington City Schools', 35.834331, -80.248062, '1010 Fair Street, Lexington', 300, 0, 18),
(69, 'Davidson County Head Start', 35.813274, -80.261128, '962 South Talbert Boulevard, Lexington', 300, 0, 18),
(70, 'Davidson Charter Academy', 35.845764, -80.269054, '500 Biesecker Road, Lexington', 300, 0, 18),
(71, 'Tiny Tot Early Head Start', 35.796394, -80.257700, '215 Federal Street, Lexington', 300, 0, 18),
(72, 'South Lexington School', 35.796504, -80.261221, '1000 Cotton Grove Road, Lexington', 300, 0, 18);

-- --------------------------------------------------------

--
-- Table structure for table `tornadoes`
--

DROP TABLE IF EXISTS `tornadoes`;
CREATE TABLE `tornadoes` (
  `id` int(11) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Wind` decimal(5,2) DEFAULT NULL,
  `Category` enum('EF0','EF1','EF2','EF3','EF4','EF5') DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `First_Name` varchar(255) DEFAULT NULL,
  `Last_Name` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `userType` enum('USER','ADMIN') DEFAULT 'USER',
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiration` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `First_Name`, `Last_Name`, `Password`, `Latitude`, `Longitude`, `Email`, `userType`, `resetToken`, `resetTokenExpiration`) VALUES
(1, 'John', 'Doe', '$2b$10$jhBK9yIxmOW23sH4lfiwcuLsLWZwJ5MyaeepWJBE/IEssrG2lUVl.', NULL, NULL, 'johndoe@example.com', 'USER', NULL, NULL),
(2, 'Jane', 'Doe', '$2b$10$Uc89srhs6f5IH3MT2M3Ly.BSal5yNVTS6ZkBNCGImY5Wm0tLFDHqO', NULL, NULL, 'janedoe@example.com', 'USER', NULL, NULL),
(3, 'admin', 'admin', '$2b$10$XjfNFRN9N9wLi7ZPNJZHSuoO2W8LEzTfXiJ4B1zYxwBjJMYAXjmGa', NULL, NULL, 'a@e.com', 'ADMIN', NULL, NULL),
(4, 'Jon', 'Mo', '$2b$10$bBXMJYt2aykUYZi/km1tK.tr.4PnPcT9Skq.7pMivstlG2uQROk7m', NULL, NULL, 'j_moreno@uncg.edu', 'USER', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `disasterzones`
--
ALTER TABLE `disasterzones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `earthquakes`
--
ALTER TABLE `earthquakes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fires`
--
ALTER TABLE `fires`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `floods`
--
ALTER TABLE `floods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hurricanes`
--
ALTER TABLE `hurricanes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landslides`
--
ALTER TABLE `landslides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `disasterzone_id` (`disasterzone_id`);

--
-- Indexes for table `notification_users`
--
ALTER TABLE `notification_users`
  ADD PRIMARY KEY (`notification_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shelters`
--
ALTER TABLE `shelters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disasterzone_id` (`disasterzone_id`);

--
-- Indexes for table `tornadoes`
--
ALTER TABLE `tornadoes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `disasterzones`
--
ALTER TABLE `disasterzones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `earthquakes`
--
ALTER TABLE `earthquakes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fires`
--
ALTER TABLE `fires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `floods`
--
ALTER TABLE `floods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hurricanes`
--
ALTER TABLE `hurricanes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landslides`
--
ALTER TABLE `landslides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shelters`
--
ALTER TABLE `shelters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `tornadoes`
--
ALTER TABLE `tornadoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`disasterzone_id`) REFERENCES `disasterzones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_users`
--
ALTER TABLE `notification_users`
  ADD CONSTRAINT `notification_users_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shelters`
--
ALTER TABLE `shelters`
  ADD CONSTRAINT `shelters_ibfk_1` FOREIGN KEY (`disasterzone_id`) REFERENCES `disasterzones` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
