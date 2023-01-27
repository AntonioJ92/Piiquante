const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const stuffCtrl = require('../controllers/sauces');

// Route POST pour enregistrer chaque Sauce renseignée dans la base de données
router.post('/', auth, multer, stuffCtrl.creationSauce);
  
// Route PUT pour valider les modifications apportées a la Sauce sur laquelle on aura cliqué
router.put('/:id', auth, multer, stuffCtrl.modificationSauce);
  
// Route DELETE permettant de supprimer un objet de la base de données
router.delete('/:id', auth, stuffCtrl.suppressionSauce);
  
// Route GET permettant de récuperer une Sauce bien spécifique
router.get('/:id', auth, stuffCtrl.jaiChoisiCetteSauce); // Requete parmis les Thing de l'hôte via son id
    
// Route GET permettant de récuperer la liste complète des Sauce créees
router.get('/', auth, stuffCtrl.montreMoiLesSauces);

// Route POST permettant d'enregistrer les like/dislike selon l'id de l'utilisateur
router.post('/:id/like', auth, stuffCtrl.jaimeOuPasLaSauce);

module.exports = router;