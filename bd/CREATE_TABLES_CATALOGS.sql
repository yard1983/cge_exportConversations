/**CATALOGS**/

USE genesys;

DROP TABLE IF EXISTS cat_user;
DROP TABLE IF EXISTS cat_wrapupcode;
DROP TABLE IF EXISTS cat_queue;
DROP TABLE IF EXISTS cat_campaign;
DROP TABLE IF EXISTS cat_skill;
DROP TABLE IF EXISTS cat_contactlist;
DROP TABLE IF EXISTS cat_outcome;

/*Users*/
CREATE TABLE cat_user (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), email VARCHAR(100), username VARCHAR(100));

/*WrapUpCode*/
CREATE TABLE cat_wrapupcode (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

/*Queue*/
CREATE TABLE cat_queue (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

/*Campaign*/
CREATE TABLE cat_campaign (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

/*Skill*/
CREATE TABLE cat_skill (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

/*contact list*/
CREATE TABLE cat_contactlist (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

/*Outcome*/
CREATE TABLE cat_outcome (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200));

