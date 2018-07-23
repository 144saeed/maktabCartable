CREATE DATABASE  IF NOT EXISTS `ecartable` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ecartable`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecartable
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addressinfo`
--

DROP TABLE IF EXISTS `addressinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addressinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `address` longtext,
  PRIMARY KEY (`id`,`user_id`),
  KEY `fk_addressInfo_user1_idx` (`user_id`),
  CONSTRAINT `fk_addressInfo_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addressinfo`
--

LOCK TABLES `addressinfo` WRITE;
/*!40000 ALTER TABLE `addressinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `addressinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers_has_profiles`
--

DROP TABLE IF EXISTS `answers_has_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers_has_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `answers_id` int(11) NOT NULL,
  `profiles_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`answers_id`,`profiles_id`),
  KEY `fk_answers_has_profiles_profiles1_idx` (`profiles_id`),
  KEY `fk_answers_has_profiles_answers1_idx` (`answers_id`),
  CONSTRAINT `fk_answers_has_profiles_answers1` FOREIGN KEY (`answers_id`) REFERENCES `answers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_answers_has_profiles_profiles1` FOREIGN KEY (`profiles_id`) REFERENCES `profiles` (`profiles_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers_has_profiles`
--

LOCK TABLES `answers_has_profiles` WRITE;
/*!40000 ALTER TABLE `answers_has_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers_has_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callinfo`
--

DROP TABLE IF EXISTS `callinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `callinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `fk_callInfo_user1_idx` (`user_id`),
  CONSTRAINT `fk_callInfo_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callinfo`
--

LOCK TABLES `callinfo` WRITE;
/*!40000 ALTER TABLE `callinfo` DISABLE KEYS */;
INSERT INTO `callinfo` VALUES (1,1,'mobile','0936936936');
/*!40000 ALTER TABLE `callinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `downloads`
--

DROP TABLE IF EXISTS `downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `downloads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_has_files_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`profile_has_files_id`),
  KEY `fk_downloads_profile_has_files1_idx` (`profile_has_files_id`),
  CONSTRAINT `fk_downloads_profile_has_files1` FOREIGN KEY (`profile_has_files_id`) REFERENCES `profile_has_files` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downloads`
--

LOCK TABLES `downloads` WRITE;
/*!40000 ALTER TABLE `downloads` DISABLE KEYS */;
/*!40000 ALTER TABLE `downloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eduresume`
--

DROP TABLE IF EXISTS `eduresume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eduresume` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `level` varchar(45) DEFAULT NULL,
  `institute` varchar(45) DEFAULT NULL,
  `grade` varchar(45) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `fk_eduResume_user_idx` (`user_id`),
  CONSTRAINT `fk_eduResume_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eduresume`
--

LOCK TABLES `eduresume` WRITE;
/*!40000 ALTER TABLE `eduresume` DISABLE KEYS */;
/*!40000 ALTER TABLE `eduresume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailinfo`
--

DROP TABLE IF EXISTS `emailinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emailinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `isMainEmail` tinyint(1) NOT NULL DEFAULT '0',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_emailInfo_user1_idx` (`user_id`),
  CONSTRAINT `fk_emailInfo_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailinfo`
--

LOCK TABLES `emailinfo` WRITE;
/*!40000 ALTER TABLE `emailinfo` DISABLE KEYS */;
INSERT INTO `emailinfo` VALUES (1,1,'oveisi.saeed@gmail.com',1,1),(2,2,'cuhiriju@l0real.net',1,1);
/*!40000 ALTER TABLE `emailinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fileaccesstypes`
--

DROP TABLE IF EXISTS `fileaccesstypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fileaccesstypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fileaccesstypes`
--

LOCK TABLES `fileaccesstypes` WRITE;
/*!40000 ALTER TABLE `fileaccesstypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `fileaccesstypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files_has_tags`
--

DROP TABLE IF EXISTS `files_has_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files_has_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `files_id` int(11) NOT NULL,
  `tags_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`files_id`,`tags_id`),
  KEY `fk_files_has_tags_tags1_idx` (`tags_id`),
  KEY `fk_files_has_tags_files1_idx` (`files_id`),
  CONSTRAINT `fk_files_has_tags_files1` FOREIGN KEY (`files_id`) REFERENCES `files` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_files_has_tags_tags1` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_has_tags`
--

LOCK TABLES `files_has_tags` WRITE;
/*!40000 ALTER TABLE `files_has_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `files_has_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homeworks`
--

DROP TABLE IF EXISTS `homeworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`term_id`),
  KEY `fk_homeworks_term1_idx` (`term_id`),
  CONSTRAINT `fk_homeworks_term1` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks`
--

LOCK TABLES `homeworks` WRITE;
/*!40000 ALTER TABLE `homeworks` DISABLE KEYS */;
/*!40000 ALTER TABLE `homeworks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homeworks_has_questions`
--

DROP TABLE IF EXISTS `homeworks_has_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworks_has_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeworks_id` int(11) NOT NULL,
  `questions_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`homeworks_id`,`questions_id`),
  KEY `fk_homeworks_has_questions_questions1_idx` (`questions_id`),
  KEY `fk_homeworks_has_questions_homeworks1_idx` (`homeworks_id`),
  CONSTRAINT `fk_homeworks_has_questions_homeworks1` FOREIGN KEY (`homeworks_id`) REFERENCES `homeworks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_homeworks_has_questions_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks_has_questions`
--

LOCK TABLES `homeworks_has_questions` WRITE;
/*!40000 ALTER TABLE `homeworks_has_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `homeworks_has_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homeworks_has_questions_has_answers`
--

DROP TABLE IF EXISTS `homeworks_has_questions_has_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworks_has_questions_has_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeworks_has_questions_id` int(11) NOT NULL,
  `answers_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`homeworks_has_questions_id`,`answers_id`),
  KEY `fk_homeworks_has_questions_has_answers_answers1_idx` (`answers_id`),
  KEY `fk_homeworks_has_questions_has_answers_homeworks_has_questi_idx` (`homeworks_has_questions_id`),
  CONSTRAINT `fk_homeworks_has_questions_has_answers_answers1` FOREIGN KEY (`answers_id`) REFERENCES `answers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_homeworks_has_questions_has_answers_homeworks_has_questions1` FOREIGN KEY (`homeworks_has_questions_id`) REFERENCES `homeworks_has_questions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks_has_questions_has_answers`
--

LOCK TABLES `homeworks_has_questions_has_answers` WRITE;
/*!40000 ALTER TABLE `homeworks_has_questions_has_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `homeworks_has_questions_has_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procedures`
--

DROP TABLE IF EXISTS `procedures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `procedures` (
  `procedures_id` int(11) NOT NULL AUTO_INCREMENT,
  `procedures_title` varchar(45) NOT NULL,
  `procedures_description` longtext,
  PRIMARY KEY (`procedures_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procedures`
--

LOCK TABLES `procedures` WRITE;
/*!40000 ALTER TABLE `procedures` DISABLE KEYS */;
INSERT INTO `procedures` VALUES (1,'defineUser','define a new user in portal'),(2,'defineCourse','define a new course in portal');
/*!40000 ALTER TABLE `procedures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_has_files`
--

DROP TABLE IF EXISTS `profile_has_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_has_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `files_id` int(11) NOT NULL,
  `fileAccessTypes_id` int(11) NOT NULL,
  `profiles_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`files_id`,`fileAccessTypes_id`,`profiles_id`),
  KEY `fk_user_has_files_files1_idx` (`files_id`),
  KEY `fk_user_has_files_fileAccessTypes1_idx` (`fileAccessTypes_id`),
  KEY `fk_user_has_files_profiles1_idx` (`profiles_id`),
  CONSTRAINT `fk_user_has_files_fileAccessTypes1` FOREIGN KEY (`fileAccessTypes_id`) REFERENCES `fileaccesstypes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_files_files1` FOREIGN KEY (`files_id`) REFERENCES `files` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_files_profiles1` FOREIGN KEY (`profiles_id`) REFERENCES `profiles` (`profiles_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_has_files`
--

LOCK TABLES `profile_has_files` WRITE;
/*!40000 ALTER TABLE `profile_has_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_has_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `profiles_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `rolls_id` int(11) NOT NULL,
  PRIMARY KEY (`profiles_id`,`user_id`,`term_id`,`rolls_id`),
  UNIQUE KEY `id_UNIQUE` (`profiles_id`),
  KEY `fk_profiles_user1_idx` (`user_id`),
  KEY `fk_profiles_term1_idx` (`term_id`),
  KEY `fk_profiles_rolls1_idx` (`rolls_id`),
  CONSTRAINT `fk_profiles_rolls1` FOREIGN KEY (`rolls_id`) REFERENCES `rolls` (`rolls_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_profiles_term1` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_profiles_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,1,1,1);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proresume`
--

DROP TABLE IF EXISTS `proresume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proresume` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `jobTitle` varchar(45) DEFAULT NULL,
  `institute` varchar(45) DEFAULT NULL,
  `instituteAddress` varchar(45) DEFAULT NULL,
  `phoneNumber` varchar(45) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `endingReason` longtext,
  PRIMARY KEY (`id`,`user_id`),
  KEY `fk_proResume_user1_idx` (`user_id`),
  CONSTRAINT `fk_proResume_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proresume`
--

LOCK TABLES `proresume` WRITE;
/*!40000 ALTER TABLE `proresume` DISABLE KEYS */;
INSERT INTO `proresume` VALUES (1,1,'group manager','havapayeh','tehran-karaj hwy- eram ','021','2006-01-01','2007-01-01',''),(2,1,'simulation mnager','havapayeh','tehran-karaj hwy- eram ','021','2006-01-01','2008-02-05',NULL);
/*!40000 ALTER TABLE `proresume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions_has_files`
--

DROP TABLE IF EXISTS `questions_has_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions_has_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questions_id` int(11) NOT NULL,
  `files_id` int(11) NOT NULL,
  `designer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`questions_id`,`files_id`,`designer_id`),
  KEY `fk_questions_has_files_files1_idx` (`files_id`),
  KEY `fk_questions_has_files_questions1_idx` (`questions_id`),
  KEY `fk_questions_has_files_profiles1_idx` (`designer_id`),
  CONSTRAINT `fk_questions_has_files_files1` FOREIGN KEY (`files_id`) REFERENCES `files` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_files_profiles1` FOREIGN KEY (`designer_id`) REFERENCES `profiles` (`profiles_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_files_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions_has_files`
--

LOCK TABLES `questions_has_files` WRITE;
/*!40000 ALTER TABLE `questions_has_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions_has_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions_has_tags`
--

DROP TABLE IF EXISTS `questions_has_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions_has_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questions_id` int(11) NOT NULL,
  `tags_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`questions_id`,`tags_id`),
  KEY `fk_questions_has_tags_tags1_idx` (`tags_id`),
  KEY `fk_questions_has_tags_questions1_idx` (`questions_id`),
  CONSTRAINT `fk_questions_has_tags_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_tags_tags1` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions_has_tags`
--

LOCK TABLES `questions_has_tags` WRITE;
/*!40000 ALTER TABLE `questions_has_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions_has_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolls`
--

DROP TABLE IF EXISTS `rolls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rolls` (
  `rolls_id` int(11) NOT NULL AUTO_INCREMENT,
  `rolls_title` varchar(45) DEFAULT NULL,
  `rolls_description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`rolls_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolls`
--

LOCK TABLES `rolls` WRITE;
/*!40000 ALTER TABLE `rolls` DISABLE KEYS */;
INSERT INTO `rolls` VALUES (1,'admin','portal Administrator'),(2,'supervisor','maktab supervisor'),(3,'teacher','maktab teacher'),(4,'student','maktab student');
/*!40000 ALTER TABLE `rolls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolls_has_procedures`
--

DROP TABLE IF EXISTS `rolls_has_procedures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rolls_has_procedures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rolls_id` int(11) NOT NULL,
  `procedures_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`rolls_id`,`procedures_id`),
  KEY `fk_rolls_has_procedures_procedures1_idx` (`procedures_id`),
  KEY `fk_rolls_has_procedures_rolls1_idx` (`rolls_id`),
  CONSTRAINT `fk_rolls_has_procedures_procedures1` FOREIGN KEY (`procedures_id`) REFERENCES `procedures` (`procedures_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rolls_has_procedures_rolls1` FOREIGN KEY (`rolls_id`) REFERENCES `rolls` (`rolls_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolls_has_procedures`
--

LOCK TABLES `rolls_has_procedures` WRITE;
/*!40000 ALTER TABLE `rolls_has_procedures` DISABLE KEYS */;
INSERT INTO `rolls_has_procedures` VALUES (1,1,1),(2,1,2);
/*!40000 ALTER TABLE `rolls_has_procedures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term`
--

DROP TABLE IF EXISTS `term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `term` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `numOfSessions` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term`
--

LOCK TABLES `term` WRITE;
/*!40000 ALTER TABLE `term` DISABLE KEYS */;
INSERT INTO `term` VALUES (1,'maktab13','front end','description1',NULL,NULL,NULL),(2,'maktab14','back end','desc2',NULL,NULL,NULL);
/*!40000 ALTER TABLE `term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nationalId` varchar(45) NOT NULL,
  `password` mediumtext,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `fathersName` varchar(45) DEFAULT NULL,
  `personalPic` varchar(45) DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`id`,`nationalId`),
  UNIQUE KEY `nationalId_UNIQUE` (`nationalId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$12$ZT0jewNln3zQzLNDOjD/X.SWXZoDQxmF3p2SfRo./y8SqxtMhIeYK','ادمین','سایت','','','ادمین سایت'),(2,'0123456789','$2b$10$Z/6pPgAIseyZjtt7.ddY0OyioWtMuEhqGsNyTp4cMDF828osNBqyO','aaa','bbb',NULL,NULL,'ccc');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_tags`
--

DROP TABLE IF EXISTS `user_has_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_has_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `tags_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`user_id`,`tags_id`),
  KEY `fk_user_has_tags_tags1_idx` (`tags_id`),
  KEY `fk_user_has_tags_user1_idx` (`user_id`),
  CONSTRAINT `fk_user_has_tags_tags1` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_tags_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_tags`
--

LOCK TABLES `user_has_tags` WRITE;
/*!40000 ALTER TABLE `user_has_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_has_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationlinks`
--

DROP TABLE IF EXISTS `verificationlinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verificationlinks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `link` longtext,
  `date` bigint(20) DEFAULT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `emailInfo_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`emailInfo_id`),
  KEY `fk_verificationLinks_emailInfo1_idx` (`emailInfo_id`),
  CONSTRAINT `fk_verificationLinks_emailInfo1` FOREIGN KEY (`emailInfo_id`) REFERENCES `emailinfo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationlinks`
--

LOCK TABLES `verificationlinks` WRITE;
/*!40000 ALTER TABLE `verificationlinks` DISABLE KEYS */;
INSERT INTO `verificationlinks` VALUES (1,'$2b$10$eWkmbsdMeodHSGeby1iRLO5yVsuxFZVKA5Z.xK3dpaRbPe8xjXSTi',1531976344674,0,2);
/*!40000 ALTER TABLE `verificationlinks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-23 11:14:39
