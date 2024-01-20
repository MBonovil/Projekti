CREATE DATABASE UmjetnickaGalerijaDB;

CREATE TABLE Umjetnik( 
              umjetnik_id int NOT NULL PRIMARY KEY, 
              ime varchar(100), 
              prezime varchar(100), 
              datum_rodenja date, 
              mjesto_rodenja varchar(100),
			  adresa varchar(100),
              zip int NOT NULL, 
              broj_mobitela varchar(100),  
);

CREATE TABLE PostanskiBroj( 
              zip_id int NOT NULL PRIMARY KEY,
              grad varchar(100), 
              drzava varchar(100) 
);

CREATE TABLE Posjetitelj( 
              posjetitelj_id int NOT NULL PRIMARY KEY, 
              ime varchar(100), 
              prezime varchar(100), 
              broj_mobitela varchar(100),
			  adresa varchar(100),
              zip int NOT NULL 
);

CREATE TABLE Izlozba( 
              izlozba_id int NOT NULL PRIMARY KEY, 
              ime_galerije varchar(100), 
              datum_pocetka date, 
              datum_zavrsetka date,
			  adresa varchar(100),
              zip int NOT NULL
);

CREATE TABLE Umjetnina_Izlozba( 
              iz_id int NOT NULL, 
              um_id int NOT NULL,
			  broj_umjetnine int
);

CREATE TABLE Tip( 
              tip_id int NOT NULL PRIMARY KEY,
			  naziv varchar(100)
);

CREATE TABLE Stavka( 
             stavka_id int NOT NULL PRIMARY KEY, 
             t_id int NOT NULL, 
             datum_dostave date, 
             datum_kraja date,
             cijena int,
			 adresa_dostave varchar(100),
			 zip int NOT NULL,
			 u_id int,
			 p_id int
);

CREATE TABLE Umjetnina( 
             umjetnina_id  int NOT NULL PRIMARY KEY, 
             godina  int, 
             naslov  varchar(100), 
             cijena  int, 
             opis  varchar(200), 
             kategorija  varchar(100), 
             u_id int NOT NULL
);

ALTER TABLE Umjetnina_Izlozba 
ADD FOREIGN KEY (iz_id) REFERENCES  Izlozba(izlozba_id);

ALTER TABLE Umjetnina_Izlozba 
ADD FOREIGN KEY (um_id)  REFERENCES Umjetnina(umjetnina_id);

ALTER TABLE Umjetnik 
ADD FOREIGN KEY (zip)  REFERENCES  PostanskiBroj(zip_id);

ALTER TABLE Izlozba 
ADD FOREIGN KEY (zip)  REFERENCES  PostanskiBroj(zip_id);

ALTER TABLE Umjetnina 
ADD FOREIGN KEY (u_id)  REFERENCES  Umjetnik(umjetnik_id);

ALTER TABLE Posjetitelj 
ADD FOREIGN KEY (zip)  REFERENCES  PostanskiBroj(zip_id);

ALTER TABLE Stavka 
ADD FOREIGN KEY (p_id)  REFERENCES  Posjetitelj(posjetitelj_id);

ALTER TABLE Stavka 
ADD FOREIGN KEY (u_id)  REFERENCES  Umjetnina(umjetnina_id);

ALTER TABLE Stavka 
ADD FOREIGN KEY (zip)  REFERENCES  PostanskiBroj(zip_id);

ALTER TABLE Stavka 
ADD FOREIGN KEY (t_id)  REFERENCES  Tip(tip_id);