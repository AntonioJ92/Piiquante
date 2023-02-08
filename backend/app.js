const express = require('express'); // Importation du package express
//const bodyParser = require('body-parser'); // Importation du package body-parser
const mongoose = require('mongoose'); // Importation du package mongoose qui permet d'interagir avec notre base de donnée MongoDB (mise en place d'un schema d'objet, récuperation, envoi, modification et suppression de données)
const path = require('path');
require('dotenv').config();

const saucesRoutes = require('./routes/sauces'); // Importation des routes menants aux differentes fonctions liées aux sauces
const userRoutes = require('./routes/user'); // Importation des routes menants aux differentes fonctions liées a l'authentification utilisateur


const app = express(); // Création d'une application Express

mongoose.connect(process.env.DB_URL, // Méthode permettant de connecter l'application à la base de donnée MongoDB ayant en clé d'acces DB_URL via le fichier .env
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
);

app.use(express.json()); // Middleware permettant d'intercepter toutes les requêtes contenant du JSON et met a disposition ce corps de requête dans req.body, fonctionne de la même maniere que "bodyParser.json"

app.use((req, res, next) => { // Ajout d'header autorisant l'application d'acceder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*'); // Header permettant d'acceder à l'API depuis n'importe quelle origine (*)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Header permettant d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Header permettant d'envoyer des requêtes avec les methodes mentionnées
    next();
});

//app.use(bodyParser.json()); // Middleware permettant d'intercepter toutes les requêtes contenant du JSON et met a disposition ce corps de requête dans req.body, fonctionne de la même maniere que "express.json"

app.use('/images', express.static(path.join(__dirname, 'images'))); // Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/api/sauces', saucesRoutes); // Middleware permettant d'utiliser les routes menants aux differentes fonctions liées aux sauces
app.use('/api/auth', userRoutes); // Middleware permettant d'utiliser les routes menants aux fonctions liées a l'authentification utilisateur

module.exports = app; // Exportation de l'application Express pour pouvoir y acceder depuis le serveur node