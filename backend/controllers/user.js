const bcrypt = require('bcrypt'); // Importation du package bcrypt
const jwt = require('jsonwebtoken'); // Importation du package jsonwebtoken permettant de créer et de verifier les tokens

const User = require('../models/User') // Importation du modele "User"

exports.signup = (req, res, next) => { // Exportation de la fonction permettant de créer un compte utilisateur
    bcrypt.hash(req.body.password, 10) // Methode hash de bcrypt va crypter password 10 fois (c'est ce qu'on appelle "saler" le mot de passe. Plus on sale, plus le hachage sera sécurisé)
    // Il s'agit d'une fonction asynchrone qui renvoie une Promesse dans laquelle nous recevons le hash généré
    .then(hash => {
        const user = new User({ // On renseigne notre modele user par les valeurs ci-dessous
            email: req.body.email, // L'email renseigné via le frontend
            password: hash // Le mot de passe crypté ligne 7
        });
        user.save() // Sauvegarde de notre modele user renseigné dans notre base de donnée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => { // Exportation de la fonction permettant de se connecter a son compte utilisateur
    User.findOne({ email: req.body.email }) // On vient chercher un User par son adresse email
    .then(user => {
        if (!user) { // Si les identifiants(email + password) ne correspondent pas
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); // On renvoie au front une erreur d'authentification
        } // Sinon
        bcrypt.compare(req.body.password, user.password) // Methode "compare" de bcrypt vient comparer le password renseigné via le front avec le password associé a l'email dans la base de donnée
        .then(valid => {
            if (!valid) { // Si la comparaison du password n'est pas validée
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // On renvoie au front une erreur d'authentification
            } // Sinon
            res.status(200).json({ // On renvoie au front un code de validation avec un objet qui va contenir les informations necessaires à l'authentification des requetes qui seront emises par la suite par le front
                userId: user._id, // L'instance new ligne 10 genere systematiquement un "_id" à notre "user" que l'on va donc ici associé à la clé "userId"
                token: jwt.sign( // Methode sign de jwt permettant d'associer un token (une empreinte) generé aléatoirement à un "user" via son "_id"
                    { userId: user._id }, // 1er argument correspond aux données que l'on veut encoder(payload), ici ce sera l'id de notre user qui est généré automatiquement lors d'une création de nouvelle instance (ligne 10)
                    process.env.TOKEN, // 2e argument correspond à la clé secrète pour l'encodage
                    { expiresIn: '24h' } // 3e argument est un argument de configuration, ici on va appliquer un délai d'expiration à notre token
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
 };