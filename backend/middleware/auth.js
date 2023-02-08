const jwt = require('jsonwebtoken'); // Importation du package jsonwebtoken permettant de créer et de verifier les tokens
require('dotenv').config();
 
module.exports = (req, res, next) => { // Exportation de la fonction de l'authentification utilisateur
// Étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try/catch ci-dessous
   try {
       const token = req.headers.authorization.split(' ')[1]; // On recupere le token généré lors de l'authentification en se separant de "Bearer " qui se trouve avant le token
       const decodedToken = jwt.verify(token, process.env.TOKEN); // On decode le token avec la methode verify de jwt avec en parametre le token que l'on a recuperer ligne 7 et la clé secrète
       const userId = decodedToken.userId; // On recupere le userId du token decodé
       req.auth = { // Création de l'objet "auth" au sein de la requete
           userId: userId // Avec en clé "userId" et en valeur l'id du user qui provient du token decodé
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};