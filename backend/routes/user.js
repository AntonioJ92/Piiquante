const express = require('express'); // Importation du package express
const router = express.Router(); // Méthode Router d'express permet de créer les routes ci-dessous
const userCtrl = require('../controllers/user'); // Importation des fonctions liées à l'authentification utilisateur

// Methode POST permet de stocker une nouvelle donnée
router.post('/signup', userCtrl.signup); // Route d'acces à la fonction "signup" permettant de créer un compte utilisateur
router.post('/login', userCtrl.login); // Route d'acces à la fonction "login" permettant de se connecter a son compte utilisateur

module.exports = router; // Methode exports permet d'exporter les differentes routes créees ci-dessus