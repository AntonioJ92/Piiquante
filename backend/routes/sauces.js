const express = require('express'); // Importation du package express
const auth = require('../middleware/auth'); // Importation de notre fonction d'authentification
const multer = require('../middleware/multer-config'); // Importation du middleware multer du fichier multer-config.js
const router = express.Router(); // Methode Router d'express permet de créer les routes ci-dessous

const stuffCtrl = require('../controllers/sauces'); // Importation des fonctions liées aux sauces

// Methode POST permet de stocker une nouvelle donnée
router.post('/', auth, multer, stuffCtrl.creationSauce); // Route d'acces à la fonction "creationSauce" permettant de créer une sauce dans une base de donnée
  
// Methode PUT permet de modifier une/des donnée(s)
router.put('/:id', auth, multer, stuffCtrl.modificationSauce); // Route d'acces à la fonction "modificationSauce" permettant de modifier une sauce de la base de donnée
  
// Methode DELETE permettant de supprimer une/des donnée(s)
router.delete('/:id', auth, stuffCtrl.suppressionSauce); // Route d'acces à la fonction "suppressionSauce" permettant de supprimer une sauce de la base de donnée
  
// Methode GET permettant de recuperer une/des donnée(s)
router.get('/:id', auth, stuffCtrl.jaiChoisiCetteSauce); // Route d'acces à la fonction "jaiChoisiCetteSauce" permettant d'obtenir les details d'une sauce de la base de donnée
    
// Methode GET permettant de recuperer une/des donnée(s)
router.get('/', auth, stuffCtrl.montreMoiLesSauces); // Route d'acces à la fonction "montreMoiLesSauces" permettant d'acceder à toutes les sauces de la base de donnée

// Methode POST permet de stocker une nouvelle donnée
router.post('/:id/like', auth, stuffCtrl.jaimeOuPasLaSauce); // Route d'acces à la fonction "jaimeOuPasLaSauce" permettant de like/dislike une sauce de la base de donnée

module.exports = router; // Methode exports permet d'exporter les differentes routes créees ci-dessus