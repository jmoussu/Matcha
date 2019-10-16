# Matcha
Site de rencontre.
API node et One page app React

![0](https://user-images.githubusercontent.com/44972661/66797689-f3794300-ef0b-11e9-85ff-18b44046fec2.PNG)

# Pics

<p align="center">
  <img src="https://user-images.githubusercontent.com/44972661/66797691-f3794300-ef0b-11e9-8e0f-5e6d4070ae9b.PNG">
  <img src="https://user-images.githubusercontent.com/44972661/66797692-f3794300-ef0b-11e9-8380-867bb4969ab9.PNG">
  <img src="https://user-images.githubusercontent.com/44972661/66797693-f3794300-ef0b-11e9-9a6c-571d262b09c8.PNG">
  <img src="https://user-images.githubusercontent.com/44972661/66797694-f411d980-ef0b-11e9-9365-f64f15a3072c.PNG">
</p>

# Feature
Gestion de comptes et d'utilisateurs

Mail de validation et oublie de mot de passe

Géolocalisation par navigateur ou ip

Sélection des profils proposés en fonction des affinitées amoureuses et de la localisation

Recherche profil par localisation ou autres parametres : âge tags ...

Systeme de score visible

Systeme de match

Chat en direct disponible après un match

notification en direct

Historique des personnes ayant consultées votre profil

Historique des personnes ayant like votre profil

Setting panel

Preferences amoureuses

Données personelles modifiables: Genre, Nom, Email ...

Gestion de tags

Upload de photos et Systeme de photo de profil

Génération d'une seed de faux comptes pour nourrire l'application

Seed aléatoire.

Les images de profil sont faites en génération procédurale aléatoire en style 8bit


# Comment l'utiliser ?

Une base de donné sql est nessesaire les informations de connection sont modifiables dans src/mysql_info.js

### Dans les dosiers server et client :
`npm install`

### Côté server
`node .`

### Lancer l'install et la seed :
Install : `curl -d '{"install_password":"Admin123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/install`

Seed : `curl -d '{"seed_password":"Admin123", "nb_fake":700}' -H "Content-Type: application/json" -X POST http://localhost:3001/seed`

### Côté client:

`npm start`

# Bonus
Api restfull + Documentation des routes

Seed Avatar en génération procédurale sexe correspondant a l'image.

Single page application.

Socket.io pour les likes et notif en direct sur les mêmes pages.

Autocomplétion du nom des villes lors du changement de localisation.

# Contributor
https://gitlab.com/gigistone/

