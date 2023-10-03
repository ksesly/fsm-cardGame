CREATE DATABASE ucode_web;
CREATE USER 'monyshchen'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON ucode_web.* TO 'monyshchen'@'localhost';


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(100) DEFAULT 'user',
    UNIQUE KEY unique_email (email)
);

CREATE TABLE IF NOT EXISTS `card` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`image` varchar(200) NOT NULL,
	`title` varchar(50) NOT NULL,
	`description` varchar(100) NOT NULL,
	`cost` INT NOT NULL,
	`damage` INT NOT NULL,
	`defence` INT NOT NULL,
	PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `table` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`player_1` INT NOT NULL,
	`player_2` INT NOT NULL,
	`health_p1` INT NOT NULL DEFAULT 20,
	`health_p2` INT NOT NULL DEFAULT 20,
	`move` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `card_on_table` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`player_id` INT NOT NULL,
	`health` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `table_card` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`table_id` INT NOT NULL,
	`card_id` INT NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`id`) REFERENCES `card`(`id`),
	FOREIGN KEY (`table_id`) REFERENCES `table`(`id`),
	FOREIGN KEY (`card_id`) REFERENCES `card_on_table`(`id`)
);

INSERT INTO `ucode_web`.`card` (`image`, `title`, `description`, `cost`, `damage`, `defence`) VALUES ('321', 'Anakin', 'anakin desc', '3', '2', '1'), ("img1", 'Captain Rex', 'rex desc', '2', '10', '5');
