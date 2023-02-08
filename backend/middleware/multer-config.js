const multer = require('multer'); // Importation du package multer permettant de faciliter la gestion de fichiers envoyés avec des requetes http vers notre API

// L'API ne connait pas l'extension du fichier lorsqu'il est envoyé depuis le frontend, on a cependant acces a leur mimetype. On créer donc le dictionnaire ci-dessous afin de traduire le mimetype d'un fichier en extension que l'on utilisera ligne 17
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Création d'objet de configuration pour multer
const storage = multer.diskStorage({ // Methode diskStorage de multer permettant d'enregistrer notre objet de configuration sur le disque
  destination: (req, file, callback) => { // Fonction indiquant a multer ou enregistrer les fichiers
    callback(null, 'images'); // On appelle le callback en ayant null en 1er argument pour indiquer qu'il n'y a pas eu d'erreur, puis le nom du dossier en 2e argument
  },
  filename: (req, file, callback) => { // Fonction indiquant a multer quel nom donner aux fichiers
    const name = file.originalname.split(' ').join('_'); // Méthode originalname permet de garder le nom de base de notre fichier, avec split on retire les espace qu'il pourrait y avoir et qu'on va remplacer par des underscore grace a join
    const extension = MIME_TYPES[file.mimetype]; // Explication ligne 3
    callback(null, name + Date.now() + '.' + extension); // On appelle le callback en ayant null en 1er argument pour indiquer qu'il n'y a pas eu d'erreur, puis le nom du fichier que l'on envoie (le nom de base avec des underscore a la place des espaces + un timestamp(système d'horodatage qui donne le nombre de temps en secondes qui s'écoule depuis le 1er janvier 1970 à 00h) + l'extension que l'on aura crée ligne 17)
  }
});

module.exports = multer({storage: storage}).single('image'); // Exportation de l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image