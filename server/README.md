# matcha-server-master

installer node.js
npm init
npm install express --save
npm install --save mysql
(sudo) npm install -g nodemon

1/ lancer server mysql
2/ npm install
3/ node . OR nodemon

Install : curl -d '{"install_password":"Admin123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/install
Seed : curl -d '{"seed_password":"Admin123", "nb_fake":700}' -H "Content-Type: application/json" -X POST http://localhost:3001/seed

Liste de bonus :
Api restfull + doc
seed Avatar en généqtion prcédurale femmme homme image corespondante.
Single page application.
Socket pour les like notif en direct sur les meme page.
Autocompétion des ville lors du changement de localisation.
