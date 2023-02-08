const Sauce = require('../models/sauce'); // Importation du modele "Sauce"
const fs = require('fs'); // Importation du package fs (file system) qui nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.

exports.creationSauce = (req, res, next) => { // Exportation de la fonction permettant de créer une sauce
    const sauceObject = JSON.parse(req.body.sauce); // On convertit notre sauce créee en "entier"
    delete sauceObject._id; // MongoDB genere automatiquement un champs "_id" pour chaque sauce créee, nous n'en avons pas besoin, nous le supprimons donc
    delete sauceObject._userId; // Nous supprimons le champ_userId de la requête envoyée par le client car nous ne devons pas lui faire confiance (rien ne l’empêcherait de nous passer le userId d’une autre personne). Nous le remplaçons en base de données par le _userId extrait du token par le middleware d’authentification ligne 12
    // L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ "_id"
    const sauce = new Sauce({ // Création d'une nouvelle instance avec le modele Sauce
        ...sauceObject, // L'opérateur spread "..." copie les champs du corps de la requête, et detaille chaque élément de notre schema de sauce
        userId: req.auth.userId, // On extrait l'userId du middleware d'authentification
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http'). Nous ajoutons '://', puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000'). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
        likes: 0, // Le nombre de like lors de la création d'une sauce, sera par defaut de 0
        dislikes: 0, // Le nombre de dislike lors de la création d'une sauce, sera par defaut de 0
        usersLiked: [], // Le tableau contenant l'id des users aimant la sauce lors de sa création sera par defaut vide
        usersDisliked: [] // Le tableau contenant l'id des users n'aimant pas la sauce lors de sa création sera par defaut vide
    });
    sauce.save() // Sauvegarde de notre création d'objet dans la base de donnée et retourne la promesse ci-dessous
    // On renvoi une réponse au frontend pour éviter l'expiration de la requete:
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) // La requete a bien fonctionnée
    .catch(res.status(404)); // Une erreur est survenue lors de la requete
};

exports.jaiChoisiCetteSauce = (req, res, next) => { // Exportation de la fonction permettant de voir en detail une sauce disponible dans la base de donnée
    Sauce.findOne({ _id: req.params.id }) // Méthode findOne pour trouver l'objet sur lequel on aura cliqué
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.montreMoiLesSauces = (req, res, next) => { // Exportation de la fonction permettant de voir toutes les sauces disponibles dans la base de donnée
    Sauce.find() // Méthode find pour trouver tous les objets crées par l'utilisateur
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.suppressionSauce = (req, res, next) => { // Exportation de la fonction permettant de supprimer une sauce dont on est le créateur
    Sauce.findOne({ _id: req.params.id}) // Méthode findOne pour trouver l'objet sur lequel on aura cliqué
       .then(sauce => {
           if (sauce.userId != req.auth.userId) { // Si l'utilsateur n'est pas authentifié
               res.status(401).json({message: 'Not authorized'}); // On renvoie un message d'erreur
           } else { // Sinon
               const filename = sauce.imageUrl.split('/images/')[1]; // On extrait l'url de l'image de notre sauce
               fs.unlink(`images/${filename}`, () => { // Fonction unlink du package fs pour supprimer l'image, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
                   Sauce.deleteOne({_id: req.params.id}) // Dans le callback, nous implémentons la logique d'origine en supprimant la Sauce de la base de données.
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.modificationSauce = (req, res, next) => { // Exportation de la fonction permettant de modifier les details d'une sauce dont on est le créateur
    const sauceObject = req.file ? { // On crée un objet sauceObject qui regarde si req.file existe ou non
        // S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant:
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId; // Nous supprimons le champ_userId de la requête envoyée par le client car nous ne devons pas lui faire confiance (rien ne l’empêcherait de nous passer le userId d’une autre personne).
    Sauce.findOne({_id: req.params.id}) // Méthode pour trouver la sauce sur laquelle on aura cliqué
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) { // Si l'utilsateur n'est pas authentifié
                res.status(403).json({ message : 'unauthorized request.'}); // On renvoie un message d'erreur
            } else { // Sinon
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // On met a jour notre sauce avec toutes les modifications envoyés dans la requete
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {res.status(400).json({ error });
        });
};

exports.jaimeOuPasLaSauce = (req, res, next) => { // Exportation de la fonction permettant de like ou dislike une sauce que l'on aura séléctionné
    Sauce.findOne({_id : req.params.id}) // Méthode pour trouver la sauce sur laquelle on aura cliqué
    .then((sauce) => {

        // Like
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){ // Si le userId du client faisant la requete du like n'est pas inclus dans le tableau "usersLiked" et si "like" est a 1
            Sauce.updateOne( // Alors on met a jour notre sauce
                {_id : req.params.id}, // Sur laquelle on aura cliqué
                {
                    $inc: {likes: 1}, // L'operateur "inc" incremente la valeur 1 à la clé "likes" de la sauce concernée
                    $push: {usersLiked: req.body.userId} // L'operateur "push" ajoute l'id de l'utilisateur dans le tableau usersLiked de la sauce concernée
                }
            )
            .then(() => res.status(201).json({ message : "Le user aime la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
        if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){ // Si le userId du client faisant la requete du like est inclus dans le tableau "usersLiked" et si "like" est a 0
            Sauce.updateOne( // Alors on met a jour notre sauce
                {_id : req.params.id}, // Sur laquelle on aura cliqué
                {
                    $inc: {likes: -1}, // L'operateur "inc" incremente la valeur -1 à la clé "likes" de la sauce concernée
                    $pull: {usersLiked: req.body.userId} // L'operateur "pull" retire l'id de l'utilisateur dans le tableau usersLiked de la sauce concernée
                }
            )
            .then(() => res.status(201).json({ message : "Le user n'aime plus la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };

        // Dislike
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){ // Si le userId du client faisant la requete du dislike n'est pas inclus dans le tableau "usersDisliked" et si "like" est a -1
            Sauce.updateOne( // Alors on met a jour notre sauce
                {_id : req.params.id}, // Sur laquelle on aura cliqué
                {
                    $inc: {dislikes: 1}, // L'operateur "inc" incremente la valeur 1 à la clé "dislikes" de la sauce concernée
                    $push: {usersDisliked: req.body.userId} // L'operateur "push" ajoute l'id de l'utilisateur dans le tableau usersDisliked de la sauce concernée
                }
            )
            .then(() => res.status(201).json({ message : "Le user deteste la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
        if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){ // Si le userId du client faisant la requete du dislike est inclus dans le tableau "usersDisliked" et si "like" est a 0
            Sauce.updateOne( // Alors on met a jour notre sauce
                {_id : req.params.id}, // Sur laquelle on aura cliqué
                {
                    $inc: {dislikes: -1}, // L'operateur "inc" incremente la valeur -1 à la clé "dislikes" de la sauce concernée
                    $pull: {usersDisliked: req.body.userId} // L'operateur "pull" retire l'id de l'utilisateur dans le tableau usersDisliked de la sauce concernée
                }
            )
            .then(() => res.status(201).json({ message : "Le user ne deteste plus la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
    })
    .catch(error => res.status(404).json({ error }));
}