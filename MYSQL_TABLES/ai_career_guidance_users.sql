-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ai_career_guidance
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `college` varchar(200) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `year` varchar(30) NOT NULL,
  `skills` text,
  `interests` text,
  `password` varchar(255) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `career_match` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `mobile` (`mobile`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Sushil Giri','girisushil@gmail.com','9876543220','VIT','CS','Third Year','Python, HTML','AI','$2b$12$FGt5TGa/40Dvdc.ScEij..VTzpemnjLmyhhZ0JZtMyH9A5hLEar0S',NULL,'AI Engineer','2026-08-05 22:53:42','2026-08-06 23:24:12'),(4,'SHREYA NAVANTH CHAVAN','student1@example.com','9689933971','Pune DIstrict Education Association\'s College of Engineering Manjari','ENTC','Final Year','Python, HTML, CSS','Artificial Intelligence','$2b$12$QHSBlkjFGT07W5DdY9l45uwj344Qpoi0ybnOJQTIY4A3DydX/ubZi',NULL,NULL,'2026-08-06 18:28:06','2026-08-06 18:28:06'),(5,'string','string','string','string','string','string','string','string','$2b$12$Asbfu/E8XQFwZc5DnRCECe.QCg2ohveEKBVuun8CjpLDSheklMhEO',NULL,NULL,'2026-08-06 23:46:31','2026-08-10 11:16:25'),(6,'Sushil Giri','sushil@gmail.com','9876543210','PDEA COEM','ENTC','BTECH','','','$2b$12$z..maLyOGvaxWpDOhf25jeh2/OyUpOCbM5WXcPG7mFp92H/Rd//da',NULL,NULL,'2026-08-06 23:46:41','2026-08-10 12:09:23'),(7,'Sneha','sne3@example.com','9876543120','VIT','Civil','Final Year',NULL,NULL,'$2b$12$yMFFCk/LDmqxso21L3/6H.hRAWu68KpuwUrkoZodnTF3mvSDtYEWe',NULL,NULL,'2026-08-07 10:14:12','2026-08-07 10:14:12'),(8,'raj','Sn@gmail.com','9689933979','VIT','Computer Engineering','First Year','Python, HTML','Embedded Systems','$2b$12$CoSvHoKTAneNEZRQsagnm.7hqgENRe8rVJLIawKBAc7rFIOWSdhWa',NULL,NULL,'2026-08-07 11:21:01','2026-08-07 11:21:01'),(9,'SUSHIL GIRI','jetry@gmail.com','8237868787','PDEA COEM','Computer Engineering','Third Year','Python','Data Science','$2b$12$Ij/uH3a8xuGbaD.RZQY8d.cFR7i2x.rIAbv/c4XxKFAUX044xXNJW','uploads/profile/f3238eac-92af-4e49-a538-6a5fa4375fd0.jpeg',NULL,'2026-08-07 11:30:38','2026-08-10 15:26:48'),(10,'Devedra','dev@gmail.com','8975582493','PDEA COEM','Computer Engineering','Final Year','HTML,CSS','Data Science','$2b$12$ImREhu.zU61sowVA1WkJpe68DxmMBdCgCKZjrGY/o6D2md1vSYshW','uploads/profile/a00260e3-0043-4ac5-a5e5-d215ea04e97e.jpeg',NULL,'2026-08-07 20:30:41','2026-08-08 15:31:49'),(11,'Sushil','g@gmail.com','9698893971','PDEA College of Engineering','ENTC','Third Year','PYTHON,SQL','CYBERSECURITY','$2b$12$BMmB2dekih/B8v26GT5Tlu3YisEetDN66gCRzVcVZr6iUgC.xmElG',NULL,NULL,'2026-08-09 10:32:03','2026-08-10 12:09:12'),(12,'SHREYA','Snc3@gmail.com','9922750593','PDEA COEM','CS','Final Year','Python, HTML','CS','$2b$12$PNKg1hQa1DrxUF5SdxGIaujhnU3RlhIY4GdBoGz3v.IklL9SMohdW',NULL,NULL,'2026-08-10 11:17:50','2026-08-10 11:17:50');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 17:03:38
