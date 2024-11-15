BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"First_Name"	TEXT,
	"Last_Name"	TEXT,
	"Password"	TEXT NOT NULL,
	"Latitude"	REAL,
	"Longitude"	REAL,
	"Email"	TEXT NOT NULL UNIQUE,
	"userType"	TEXT DEFAULT 'USER',
	"resetToken"	TEXT,
	"resetTokenExpiration"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "shelters" (
	"id"	INTEGER,
	"Name"	TEXT,
	"Latitude"	REAL,
	"Longitude"	REAL,
	"Shelter_address"	TEXT,
	"Maximum_Capacity"	INTEGER,
	"Current_Capacity"	INTEGER,
	"disasterzone_id"	INTEGER,
	FOREIGN KEY("disasterzone_id") REFERENCES "disasterzones"("id") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "disasterzones" (
	"id"	INTEGER,
	"Name"	TEXT,
	"Latitude"	REAL,
	"Longitude"	REAL,
	"Radius"	REAL,
	"HexColor"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "notifications" (
	"id"	INTEGER,
	"Message"	TEXT,
	"admin_id"	INTEGER,
	"disasterzone_id"	INTEGER,
	FOREIGN KEY("admin_id") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY("disasterzone_id") REFERENCES "disasterzones"("id") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "notification_users" (
	"notif_zone_id"	INTEGER,
	"user_id"	INTEGER,
	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY("notif_zone_id") REFERENCES "disasterzones"("id") ON DELETE CASCADE,
	PRIMARY KEY("notif_zone_id","user_id")
);
INSERT INTO "users" VALUES (1,'jun','lee','$2b$10$xNOj.EJtFAGTp.P/xXDc1Ozp2XRIfUxEME4BMniDERbG3qubi4ceS',NULL,NULL,'test@test.edu','USER',NULL,NULL);
INSERT INTO "users" VALUES (2,'admin','test','$2b$10$ILzfB3PLsfgS9Ee24li9t.VJyPUyANwgtcg4jpXnTZrloIXjl5Rdm',NULL,NULL,'a@e.com','ADMIN',NULL,NULL);
INSERT INTO "users" VALUES (3,'John','Doe','$2b$10$eXXmXeW.QbNHTjnaqJfa9ege2q7mbpvwDzZnDACVBZII4StJs1JxG',NULL,NULL,'johndoe@example.com','USER',NULL,NULL);
INSERT INTO "users" VALUES (4,'Jon','Admin','$2b$10$wVA1lhOpH9jQ50kO7ODV2u6FyD6TeEjbDKGKGTKGRGDz73lp50Wgq',NULL,NULL,'j_moreno@uncg.edu','USER',NULL,NULL);
INSERT INTO "shelters" VALUES (1,'Randlehoe High School',35.826454,-79.8212547,'4396 Tigers Den Road, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (2,'Randleman Middle School',35.8249487,-79.81776,'800 High Point Street, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (3,'Randelman Intervention Center',35.8247712,-79.8170473,'718 High Point Street, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (4,'New Market Elementary School',35.8328064,-79.8657583,'6096 U.S. 311, Sophia',300,0,30);
INSERT INTO "shelters" VALUES (5,'Head Start',35.8181278,-79.8031424,'109 North Main Street, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (6,'Randleman Elementary School',35.8096681,-79.8011154,'100 Swaim Street, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (7,'Randleman High School',35.8264485,-79.8212379,'4396 Tigers Den Road, Randleman',300,0,30);
INSERT INTO "shelters" VALUES (8,'Page High School',36.1086341,-79.7866439,'201 Alma Pinnix Drive, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (9,'Greensboro Aquatic Center',36.0574634,-79.8278359,'1921 West Gate City Boulevard, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (10,'Grimsley High School',36.0826525,-79.8144309,'801 North Josephine Boyd Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (11,'Smith High School',36.0347287,-79.8471116,'2407 South Holden Road, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (12,'First Baptist Church',36.074967,-79.803519,'1000 West Friendly Avenue, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (13,'Mendenhall Middle School',36.1094064,-79.8003294,'205 Willoughby Boulevard, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (14,'Weaver Academy',36.0706676,-79.7980979,'300 South Spring Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (15,'Melvin C Swann Jr. Middle SchoolJr school',36.0841562,-79.780827,'811 Cypress Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (16,'Otis L. Hairston Middle School',36.0819905,-79.7384102,'3911 Naco Road, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (17,'TMSA Triad Secondary School - Triad Math and Science Academy',36.0307147,-79.8089817,'700 Creek Ridge Road, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (18,'James B. Dudley High School',36.060455,-79.7644436,'1200 Lincoln Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (19,'David D Jones Elementary School',36.0555814,-79.7977255,'502 South Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (20,'Our Lady of Grace Catholic Church',36.0733302,-79.8221604,'201 South Chapman Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (21,'Allen Middle School',36.0102929,-79.8230071,'1108 Glendale Drive, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (22,'Lindley Elementary School',36.0721191,-79.830091,'2700 Camden Road, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (23,'The Middle College at UNCG',36.068973,-79.8144795,'1510 Walker Avenue, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (24,'The Academy at Lincoln',36.062257,-79.76547,'1016 Lincoln Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (25,'Music Instruction',36.0738434,-79.7884378,'200 North Davie Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (26,'GTCC Small Business Center',36.0501525,-79.7910508,'1451 South Elm-Eugene Street #1201, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (27,'First Presbyterian Church Welcome Center',36.08091,-79.7902,'617 North Elm Street, Greensboro',300,0,31);
INSERT INTO "shelters" VALUES (28,'Kernersville Middle School',36.1361871,-80.0734613,'110 Brown Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (29,'Bishop McGuinness Catholic High School',36.0784105,-80.061607,'1725 North Carolina 66, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (30,'First Christian Early Education Academy',36.1387959,-80.0495696,'1130 North Main Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (31,'Flip Force Gymnastics',36.1080366,-80.0483405,'1128 Snow Bridge Lane, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (32,'Southeast Middle School',36.0807,-80.089661,'1200 Old Salem Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (33,'Kernersville Family YMCA',36.1315945,-80.092712,'1113 West Mountain Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (34,'FBC Kernersville Child Development Center',36.1218153,-80.0804467,'410 Oakhurst Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (35,'Kernersville Elementary School',36.1265113,-80.0796937,'512 West Mountain Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (36,'Forest Trail Academy',36.1107601,-80.0557,'900 East Mountain Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (37,'Grace House Preschool',36.1194102,-80.1023883,'360 Hopkins Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (38,'Sunshine House of Kernersville',36.0847635,-80.1027838,'1414 Union Cross Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (39,'Triad Baptist Church',36.1058737,-80.1013952,'1175 South Main Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (40,'Childcare Network',36.1094671,-80.0784312,'820 Salisbury Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (41,'Fountain of Life Lutheran Church & Preschool',36.1181362,-80.0990947,'323 Hopkins Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (42,'Caleb''s Creek Elementary School',36.0786748,-80.0888017,'1109 Salem Crossing Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (43,'Grace Kernersville, PCA',36.1191754,-80.102461,'360 Hopkins Road, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (44,'Main Street UMC Preschool',36.1171381,-80.0772031,'306 South Main Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (45,'Kernersville Moravian Church Preschool',36.1149394,-80.080152,'504 South Main Street, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (46,'Clubhouse Academy',36.1298612,-80.0661265,'745 Cinema Court, Kernersville',300,0,32);
INSERT INTO "shelters" VALUES (47,'The Study Station',36.1091096,-80.0895304,'522 Arbor Hill Road A, Kernersville',300,0,32);
INSERT INTO "disasterzones" VALUES (29,'Archdale - Test',35.9138658283154,-79.9752469567244,2.34,'ff0000');
INSERT INTO "disasterzones" VALUES (30,'Randleman - Test',35.8129889830916,-79.8142215213856,3.32,'0905ff');
INSERT INTO "disasterzones" VALUES (31,'Greensboro',36.0653834873154,-79.7812625370106,5.33,'ffeb0a');
INSERT INTO "disasterzones" VALUES (32,'Kernersville',36.1154329664579,-80.0718094536301,2.93,'009dff');
INSERT INTO "notifications" VALUES (1,'Test',2,31);
INSERT INTO "notifications" VALUES (2,'Test',2,31);
INSERT INTO "notifications" VALUES (3,'Test',2,31);
INSERT INTO "notification_users" VALUES (31,1);
INSERT INTO "notification_users" VALUES (31,2);
INSERT INTO "notification_users" VALUES (31,3);
INSERT INTO "notification_users" VALUES (31,4);
COMMIT;
