const mongoose = require('mongoose'); // Importation du package mongoose qui permet d'interagir avec notre base de donnée MongoDB (mise en place d'un schema d'objet, récuperation, envoi, modification et suppression de données)
const uniqueValidator = require('mongoose-unique-validator'); // Importation du package mongoose-unique-validator qui permettera a un element d'etre unique dans une base de données

// Mise en place du schema type d'authentification utilisateur
const userSchema = mongoose.Schema({ // La méthode "Schema" de Mongoose permet de créer un schéma de données pour la base de données MongoDB
    email: { type: String, required: true, unique: true }, // userId sera une chaine de caractère et obligatoire pour
    password: { type: String, required: true } // userId sera une chaine de caractère et obligatoire pour
});

userSchema.plugin(uniqueValidator); // On applique le validator au schema avant que ce soit un modele

// Exportation du modele de notre schema avec comme nom "User"
module.exports = mongoose.model('User', userSchema); // La méthode "model" transforme notre modèle de user en un modèle utilisable.