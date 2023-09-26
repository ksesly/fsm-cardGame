CREATE DATABASE ucode_web;
CREATE USER 'monyshchen'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON ucode_web.* TO 'monyshchen'@'localhost';


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(100) DEFAULT 'user',
    PRIMARY KEY(id),
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

