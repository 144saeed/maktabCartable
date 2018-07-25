-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ecartable
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ecartable` ;

-- -----------------------------------------------------
-- Schema ecartable
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ecartable` DEFAULT CHARACTER SET utf8 ;
USE `ecartable` ;

-- -----------------------------------------------------
-- Table `ecartable`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`user` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nationalId` VARCHAR(45) NOT NULL,
  `password` MEDIUMTEXT NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `fathersName` VARCHAR(45) NULL,
  `personalPic` VARCHAR(45) NULL,
  `description` LONGTEXT NULL,
  `birthDate` DATE NULL,
  PRIMARY KEY (`id`, `nationalId`),
  UNIQUE INDEX `nationalId_UNIQUE` (`nationalId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`callInfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`callInfo` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`callInfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `number` VARCHAR(45) NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_callInfo_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_callInfo_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`emailInfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`emailInfo` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`emailInfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `isMainEmail` TINYINT(1) NOT NULL DEFAULT 0,
  `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_emailInfo_user1_idx` (`user_id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  CONSTRAINT `fk_emailInfo_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`addressInfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`addressInfo` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`addressInfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `address` LONGTEXT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_addressInfo_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_addressInfo_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`eduResume`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`eduResume` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`eduResume` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `level` VARCHAR(45) NULL,
  `institute` VARCHAR(45) NULL,
  `grade` VARCHAR(45) NULL,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_eduResume_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_eduResume_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`proResume`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`proResume` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`proResume` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `jobTitle` VARCHAR(45) NULL,
  `institute` VARCHAR(45) NULL,
  `instituteAddress` LONGTEXT NULL,
  `phoneNumber` VARCHAR(45) NULL,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  `endingReason` LONGTEXT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_proResume_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_proResume_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`tags` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`user_has_tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`user_has_tags` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`user_has_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `tags_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`, `tags_id`),
  INDEX `fk_user_has_tags_tags1_idx` (`tags_id` ASC),
  INDEX `fk_user_has_tags_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_has_tags_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_tags_tags1`
    FOREIGN KEY (`tags_id`)
    REFERENCES `ecartable`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`procedures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`procedures` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`procedures` (
  `procedures_id` INT NOT NULL AUTO_INCREMENT,
  `procedures_title` VARCHAR(45) NOT NULL,
  `procedures_description` LONGTEXT NULL,
  PRIMARY KEY (`procedures_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`term`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`term` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`term` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL,
  `subject` VARCHAR(45) NULL,
  `description` LONGTEXT NULL,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  `numOfSessions` INT NULL,
  `code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`, `code`),
  UNIQUE INDEX `code_UNIQUE` (`code` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`rolls`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`rolls` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`rolls` (
  `rolls_id` INT NOT NULL AUTO_INCREMENT,
  `rolls_title` VARCHAR(45) NULL,
  `rolls_description` VARCHAR(45) NULL,
  PRIMARY KEY (`rolls_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`profiles` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`profiles` (
  `profiles_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `term_id` INT NOT NULL,
  `rolls_id` INT NOT NULL,
  PRIMARY KEY (`profiles_id`, `user_id`, `term_id`, `rolls_id`),
  INDEX `fk_profiles_user1_idx` (`user_id` ASC),
  INDEX `fk_profiles_term1_idx` (`term_id` ASC),
  INDEX `fk_profiles_rolls1_idx` (`rolls_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`profiles_id` ASC),
  CONSTRAINT `fk_profiles_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ecartable`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_profiles_term1`
    FOREIGN KEY (`term_id`)
    REFERENCES `ecartable`.`term` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_profiles_rolls1`
    FOREIGN KEY (`rolls_id`)
    REFERENCES `ecartable`.`rolls` (`rolls_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`files` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `directory` LONGTEXT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`fileAccessTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`fileAccessTypes` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`fileAccessTypes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`profile_has_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`profile_has_files` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`profile_has_files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `files_id` INT NOT NULL,
  `fileAccessTypes_id` INT NOT NULL,
  `profiles_id` INT NOT NULL,
  PRIMARY KEY (`id`, `files_id`, `fileAccessTypes_id`, `profiles_id`),
  INDEX `fk_user_has_files_files1_idx` (`files_id` ASC),
  INDEX `fk_user_has_files_fileAccessTypes1_idx` (`fileAccessTypes_id` ASC),
  INDEX `fk_user_has_files_profiles1_idx` (`profiles_id` ASC),
  CONSTRAINT `fk_user_has_files_files1`
    FOREIGN KEY (`files_id`)
    REFERENCES `ecartable`.`files` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_files_fileAccessTypes1`
    FOREIGN KEY (`fileAccessTypes_id`)
    REFERENCES `ecartable`.`fileAccessTypes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_files_profiles1`
    FOREIGN KEY (`profiles_id`)
    REFERENCES `ecartable`.`profiles` (`profiles_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`files_has_tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`files_has_tags` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`files_has_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `files_id` INT NOT NULL,
  `tags_id` INT NOT NULL,
  INDEX `fk_files_has_tags_tags1_idx` (`tags_id` ASC),
  INDEX `fk_files_has_tags_files1_idx` (`files_id` ASC),
  PRIMARY KEY (`id`, `files_id`, `tags_id`),
  CONSTRAINT `fk_files_has_tags_files1`
    FOREIGN KEY (`files_id`)
    REFERENCES `ecartable`.`files` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_files_has_tags_tags1`
    FOREIGN KEY (`tags_id`)
    REFERENCES `ecartable`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`downloads`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`downloads` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`downloads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `profile_has_files_id` INT NOT NULL,
  PRIMARY KEY (`id`, `profile_has_files_id`),
  INDEX `fk_downloads_profile_has_files1_idx` (`profile_has_files_id` ASC),
  CONSTRAINT `fk_downloads_profile_has_files1`
    FOREIGN KEY (`profile_has_files_id`)
    REFERENCES `ecartable`.`profile_has_files` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`homeworks`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`homeworks` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`homeworks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `term_id` INT NOT NULL,
  PRIMARY KEY (`id`, `term_id`),
  INDEX `fk_homeworks_term1_idx` (`term_id` ASC),
  CONSTRAINT `fk_homeworks_term1`
    FOREIGN KEY (`term_id`)
    REFERENCES `ecartable`.`term` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`questions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`questions` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`questions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` LONGTEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`questions_has_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`questions_has_files` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`questions_has_files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `questions_id` INT NOT NULL,
  `files_id` INT NOT NULL,
  `designer_id` INT NOT NULL,
  INDEX `fk_questions_has_files_files1_idx` (`files_id` ASC),
  INDEX `fk_questions_has_files_questions1_idx` (`questions_id` ASC),
  PRIMARY KEY (`id`, `questions_id`, `files_id`, `designer_id`),
  INDEX `fk_questions_has_files_profiles1_idx` (`designer_id` ASC),
  CONSTRAINT `fk_questions_has_files_questions1`
    FOREIGN KEY (`questions_id`)
    REFERENCES `ecartable`.`questions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_files_files1`
    FOREIGN KEY (`files_id`)
    REFERENCES `ecartable`.`files` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_files_profiles1`
    FOREIGN KEY (`designer_id`)
    REFERENCES `ecartable`.`profiles` (`profiles_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`questions_has_tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`questions_has_tags` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`questions_has_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `questions_id` INT NOT NULL,
  `tags_id` INT NOT NULL,
  INDEX `fk_questions_has_tags_tags1_idx` (`tags_id` ASC),
  INDEX `fk_questions_has_tags_questions1_idx` (`questions_id` ASC),
  PRIMARY KEY (`id`, `questions_id`, `tags_id`),
  CONSTRAINT `fk_questions_has_tags_questions1`
    FOREIGN KEY (`questions_id`)
    REFERENCES `ecartable`.`questions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questions_has_tags_tags1`
    FOREIGN KEY (`tags_id`)
    REFERENCES `ecartable`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`homeworks_has_questions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`homeworks_has_questions` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`homeworks_has_questions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `homeworks_id` INT NOT NULL,
  `questions_id` INT NOT NULL,
  INDEX `fk_homeworks_has_questions_questions1_idx` (`questions_id` ASC),
  INDEX `fk_homeworks_has_questions_homeworks1_idx` (`homeworks_id` ASC),
  PRIMARY KEY (`id`, `homeworks_id`, `questions_id`),
  CONSTRAINT `fk_homeworks_has_questions_homeworks1`
    FOREIGN KEY (`homeworks_id`)
    REFERENCES `ecartable`.`homeworks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_homeworks_has_questions_questions1`
    FOREIGN KEY (`questions_id`)
    REFERENCES `ecartable`.`questions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`rolls_has_procedures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`rolls_has_procedures` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`rolls_has_procedures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rolls_id` INT NOT NULL,
  `procedures_id` INT NOT NULL,
  PRIMARY KEY (`id`, `rolls_id`, `procedures_id`),
  INDEX `fk_rolls_has_procedures_procedures1_idx` (`procedures_id` ASC),
  INDEX `fk_rolls_has_procedures_rolls1_idx` (`rolls_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_rolls_has_procedures_rolls1`
    FOREIGN KEY (`rolls_id`)
    REFERENCES `ecartable`.`rolls` (`rolls_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rolls_has_procedures_procedures1`
    FOREIGN KEY (`procedures_id`)
    REFERENCES `ecartable`.`procedures` (`procedures_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`answers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`answers` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`answers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`answers_has_profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`answers_has_profiles` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`answers_has_profiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `answers_id` INT NOT NULL,
  `profiles_id` INT NOT NULL,
  INDEX `fk_answers_has_profiles_profiles1_idx` (`profiles_id` ASC),
  INDEX `fk_answers_has_profiles_answers1_idx` (`answers_id` ASC),
  PRIMARY KEY (`id`, `answers_id`, `profiles_id`),
  CONSTRAINT `fk_answers_has_profiles_answers1`
    FOREIGN KEY (`answers_id`)
    REFERENCES `ecartable`.`answers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answers_has_profiles_profiles1`
    FOREIGN KEY (`profiles_id`)
    REFERENCES `ecartable`.`profiles` (`profiles_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`homeworks_has_questions_has_answers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`homeworks_has_questions_has_answers` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`homeworks_has_questions_has_answers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `homeworks_has_questions_id` INT NOT NULL,
  `answers_id` INT NOT NULL,
  INDEX `fk_homeworks_has_questions_has_answers_answers1_idx` (`answers_id` ASC),
  INDEX `fk_homeworks_has_questions_has_answers_homeworks_has_questi_idx` (`homeworks_has_questions_id` ASC),
  PRIMARY KEY (`id`, `homeworks_has_questions_id`, `answers_id`),
  CONSTRAINT `fk_homeworks_has_questions_has_answers_homeworks_has_questions1`
    FOREIGN KEY (`homeworks_has_questions_id`)
    REFERENCES `ecartable`.`homeworks_has_questions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_homeworks_has_questions_has_answers_answers1`
    FOREIGN KEY (`answers_id`)
    REFERENCES `ecartable`.`answers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ecartable`.`verificationLinks`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecartable`.`verificationLinks` ;

CREATE TABLE IF NOT EXISTS `ecartable`.`verificationLinks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `link` LONGTEXT NULL,
  `date` BIGINT NULL,
  `isUsed` TINYINT(1) NULL DEFAULT 0,
  `emailInfo_id` INT NOT NULL,
  PRIMARY KEY (`id`, `emailInfo_id`),
  INDEX `fk_verificationLinks_emailInfo1_idx` (`emailInfo_id` ASC),
  CONSTRAINT `fk_verificationLinks_emailInfo1`
    FOREIGN KEY (`emailInfo_id`)
    REFERENCES `ecartable`.`emailInfo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `ecartable`.`user`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`user` (`id`, `nationalId`, `password`, `firstName`, `lastName`, `fathersName`, `personalPic`, `description`, `birthDate`) VALUES (1, 'admin', '$2b$12$ZT0jewNln3zQzLNDOjD/X.SWXZoDQxmF3p2SfRo./y8SqxtMhIeYK', 'ادمین', 'سایت', 'پدر ادمین', '', 'ادمین سایت', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`callInfo`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`callInfo` (`id`, `user_id`, `title`, `number`) VALUES (1, 1, 'mobile', '09363636256');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`emailInfo`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`emailInfo` (`id`, `user_id`, `email`, `isMainEmail`, `isVerified`) VALUES (1, 1, 'oveisi.saeed@gmail.com', true, true);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`eduResume`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`eduResume` (`id`, `user_id`, `level`, `institute`, `grade`, `startDate`, `endDate`) VALUES (1, 1, 'PHD', 'AUT', '18', '2006-01-03', '2010-01-03');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`proResume`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`proResume` (`id`, `user_id`, `jobTitle`, `institute`, `instituteAddress`, `phoneNumber`, `startDate`, `endDate`, `endingReason`) VALUES (1, 1, 'group manager', 'havapayeh', 'tehran-karaj hwy- eram ', '021', '2006-01-01', '2007-01-01', '');
INSERT INTO `ecartable`.`proResume` (`id`, `user_id`, `jobTitle`, `institute`, `instituteAddress`, `phoneNumber`, `startDate`, `endDate`, `endingReason`) VALUES (2, 1, 'simulation mnager', 'havapayeh', 'tehran-karaj hwy- eram ', '021', '2006-01-01', '2008-02-05', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`procedures`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`procedures` (`procedures_id`, `procedures_title`, `procedures_description`) VALUES (1, 'defineUser', 'define a new user in portal');
INSERT INTO `ecartable`.`procedures` (`procedures_id`, `procedures_title`, `procedures_description`) VALUES (2, 'defineCourse', 'define a new course in portal');
INSERT INTO `ecartable`.`procedures` (`procedures_id`, `procedures_title`, `procedures_description`) VALUES (3, 'defineSupervisor', 'define new supervisor for the term');
INSERT INTO `ecartable`.`procedures` (`procedures_id`, `procedures_title`, `procedures_description`) VALUES (4, 'defineTeacher', 'define new teacher for the term');
INSERT INTO `ecartable`.`procedures` (`procedures_id`, `procedures_title`, `procedures_description`) VALUES (5, 'defineStudents', 'define new students for term');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`term`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`term` (`id`, `title`, `subject`, `description`, `startDate`, `endDate`, `numOfSessions`, `code`) VALUES (1, 'all', 'all', 'all', '2001-01-01', NULL, NULL, 'm0');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`rolls`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`rolls` (`rolls_id`, `rolls_title`, `rolls_description`) VALUES (1, 'admin', 'portal Administrator');
INSERT INTO `ecartable`.`rolls` (`rolls_id`, `rolls_title`, `rolls_description`) VALUES (2, 'supervisor', 'maktab supervisor');
INSERT INTO `ecartable`.`rolls` (`rolls_id`, `rolls_title`, `rolls_description`) VALUES (3, 'teacher', 'maktab teacher');
INSERT INTO `ecartable`.`rolls` (`rolls_id`, `rolls_title`, `rolls_description`) VALUES (4, 'student', 'maktab student');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`profiles`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`profiles` (`profiles_id`, `user_id`, `term_id`, `rolls_id`) VALUES (1, 1, 1, 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`fileAccessTypes`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`fileAccessTypes` (`id`, `type`) VALUES (1, 'HomeWork');
INSERT INTO `ecartable`.`fileAccessTypes` (`id`, `type`) VALUES (2, 'Tutorial');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ecartable`.`rolls_has_procedures`
-- -----------------------------------------------------
START TRANSACTION;
USE `ecartable`;
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (1, 1, 1);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (2, 1, 2);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (3, 1, 3);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (4, 1, 4);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (5, 2, 4);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (6, 1, 5);
INSERT INTO `ecartable`.`rolls_has_procedures` (`id`, `rolls_id`, `procedures_id`) VALUES (7, 2, 5);

COMMIT;

