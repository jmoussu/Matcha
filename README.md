# Matcha
Site de rencontre.
API node et One page app React

![0](https://user-images.githubusercontent.com/44972661/66797689-f3794300-ef0b-11e9-85ff-18b44046fec2.PNG)

# Pics

<p align="center">
  <img src="https://user-images.githubusercontent.com/44972661/66797691-f3794300-ef0b-11e9-8e0f-5e6d4070ae9b.PNG">
  
![1]()
![2](https://user-images.githubusercontent.com/44972661/66797692-f3794300-ef0b-11e9-8380-867bb4969ab9.PNG)
![3](https://user-images.githubusercontent.com/44972661/66797693-f3794300-ef0b-11e9-9a6c-571d262b09c8.PNG)
![4](https://user-images.githubusercontent.com/44972661/66797694-f411d980-ef0b-11e9-9365-f64f15a3072c.PNG)

</p>

gestion de compte et d'utilisateur
mail de validation et oublie de mot de pass

Géolocalisation par navigateur ou ip
Sélection des profil proposer en fonction des affinitée amoureuse et de la localisation
recherche profil par localisation ou autre parametre age tags ...
System de score visible
system de match
Chat en direct dissponible apres un match
notification en direct
hisstorique des perssonne ayant consulter votre profil
hisstorique des perssonne ayant like votre profil

setting 
preference amoueuse.
Donnée personel genre nom email ...
gestion de tags
photo et photo de profil
localisation

Génération d'une seed de faux comptes pour nourire l'aplication
Seed aléatoire.
Les image de profil sont fait en génération procédurale aléatoire en style 8bit


# Comment l'utiliser ?

Une base de donné sql est nessesaire les information de connection sont modifiable dans src/mysql_info.js

npm install dans le dosier server et client
node . coté server

Lancer l'install et la seed 
Install : curl -d '{"install_password":"Admin123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/install
Seed : curl -d '{"seed_password":"Admin123", "nb_fake":700}' -H "Content-Type: application/json" -X POST http://localhost:3001/seed

npm start coté client

Liste de bonus :
Api restfull + doc
seed Avatar en généqtion prcédurale femmme homme image corespondante.
Single page application.
Socket pour les like notif en direct sur les meme page.
Autocompétion des ville lors du changement de localisation.

# Contributor
https://gitlab.com/gigistone/
