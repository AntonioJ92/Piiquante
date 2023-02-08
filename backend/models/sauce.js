const mongoose = require('mongoose'); // Importation du package mongoose qui permet d'interagir avec notre base de donnée MongoDB (mise en place d'un schema d'objet, récuperation, envoi, modification et suppression de données)

// Mise en place du schema type de nos sauces
const sauceSchema = mongoose.Schema({ // La méthode "Schema" de Mongoose permet de créer un schéma de données pour la base de données MongoDB
  userId: { type: String, required: true }, // userId sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  name: { type: String, required: true }, // name sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  manufacturer: { type: String, required: true }, // manufacturer sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  description: { type: String, required: true }, // description sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  mainPepper: { type: String, required: true }, // mainPepper sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  imageUrl: { type: String, required: true }, // imageUrl sera une chaine de caractère et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  heat: { type: Number, required: true }, // heat sera un entier et obligatoire pour pouvoir finaliser notre action (CRUD = Create, Read, Update, Delete)
  likes: { type: Number, defaut: 0 }, // likes sera un entier demarrera de 0 lors de la création
  dislikes: { type: Number, defaut: 0 }, // dislikes sera un entier demarrera de 0 lors de la création
  usersLiked: { type: [String]}, // usersLiked sera un tableau d'éléments étants des chaines de caractère
  usersDisliked: { type: [String]} // usersDisliked sera un tableau d'éléments étants des chaines de caractère
});

// Exportation du modele de notre schema avec comme nom "Sauce"
module.exports = mongoose.model('Sauce', sauceSchema); // La méthode "model" transforme notre modèle de sauce en un modèle utilisable.