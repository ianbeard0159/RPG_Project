# RPG_Project
Class project for ISIT 320

# Database Update
I realized that the names for characters, enemys, modifiers, and supports should be unique. The code has been updated (as of 11/19/2021 at 6:00pm), but If you initialized the database before then, please run these querys on the database:  
  
ALTER TABLE characters ADD UNIQUE (char_name);  
ALTER TABLE enemys ADD UNIQUE (enemy_name);  
ALTER TABLE modifiers ADD UNIQUE (modifier_name);  
ALTER TABLE supports ADD UNIQUE (support_name);  
  
The characters and enemies also need AP, so if you initialized the database before 11/20/2021 at 5:00pm, run the following querys  
  
ALTER TABLE characters ADD ap_ratio INT;  
ALTER TABLE enemys ADD ap_ratio INT;  
  
I decided to rename some of the columns to make the API work easier, and to add descriptions to the attacks and supports. Here is the SQL you need to run if you initialized the database before 11/26/2021 at 12:55p
  
ALTER TABLE supports ADD description mediumtext;  
ALTER TABLE attacks ADD description mediumtext;  
  
ALTER TABLE characters RENAME COLUMN id_character TO id_characters;  
ALTER TABLE enemys RENAME COLUMN id_enemy TO id_enemys;  
ALTER TABLE attacks RENAME COLUMN id_attack TO id_attacks;  
ALTER TABLE supports RENAME COLUMN id_support TO id_supports;  
ALTER TABLE modifiers RENAME COLUMN id_modifier TO id_modifiers;  
  
ALTER TABLE characters_attacks RENAME COLUMN id_character TO id_characters;  
ALTER TABLE characters_attacks RENAME COLUMN id_attack TO id_attacks;  
ALTER TABLE enemys_attacks RENAME COLUMN id_enemy TO id_enemys;  
ALTER TABLE enemys_attacks RENAME COLUMN id_attack TO id_attacks;  
  
ALTER TABLE characters_supports RENAME COLUMN id_character TO id_characters;  
ALTER TABLE characters_supports RENAME COLUMN id_support TO id_supports;  
ALTER TABLE enemys_supports RENAME COLUMN id_enemy TO id_enemys;  
ALTER TABLE enemys_supports RENAME COLUMN id_support TO id_supports;  
  
ALTER TABLE supports_modifiers RENAME COLUMN id_modifier TO id_modifiers;  
ALTER TABLE supports_modifiers RENAME COLUMN id_support TO id_supports;  
    
# Creating a .env file
It only needs 4 lines:  
  
DB_HOST="(A host name, probably localhost unless you're being fancy)"  
DB_USER="(a username to access the database with)"  
DB_PASS="(the password for the aforementioned user)"  
DB_PORT="(The port the database is listening on, Mine is using 3306)"  
  
# Google Doc Links

Links to the Google Docs version of the word documents in the /Documents directory are provided below.

Link to design document on Google Docs: https://docs.google.com/document/d/1kXQa1XgUy67WNz3iDqlk5j8y-WlcpdNE/edit?usp=sharing&ouid=103936840555993514006&rtpof=true&sd=true

Link to RPG-Project Mechanics: https://docs.google.com/document/d/1nSxQw4DGp8yEHD4TLGDfMeaao5EUYcQDu5tbtSJiQAY/edit?usp=sharing

Link to database diagram (ERD): https://lucid.app/lucidchart/ccd4b406-ef3b-43fa-a8e2-4952a59f42d0/edit?viewport_loc=-102%2C-34%2C1522%2C1444%2C0_0&invitationId=inv_5496c20a-c975-48a3-be73-d78e2ef10bd5

Link to first status report: https://docs.google.com/document/d/1p1QzvJvIuF7y3siiqplhsaqK4uumW07J3BSsSeE-H34/edit?usp=sharing

Link to first group retrospective: https://docs.google.com/document/d/1bP7VxjffL8RT2jPW-Eum3zaZpEGesIeDwrF-bQ71V2Q/edit?usp=sharing
