const Sauce = require('../models/sauce');
const fs = require('fs');
const { strictEqual } = require('assert');

exports.creationSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save() // Sauvegarde de notre création d'objet dans la base de donnée et retourne une promesse ci-dessous
    // On renvoi une réponse au frontend pour éviter l'expiration de la requete:
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) // La requete a bien fonctionnée
    .catch(res.status(404)); // Une erreur est survenue lors de la requete
};

exports.jaiChoisiCetteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Méthode findOne pour trouver l'objet sur lequel on aura cliqué
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.montreMoiLesSauces = (req, res, next) => {
    Sauce.find() // Méthode find pour trouver tous les objets crées par l'utilisateur
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.suppressionSauce = (req, res, next) => { // Requete parmis les Sauce de l'hôte via son id
    Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.modificationSauce = (req, res, next) => { // Requete parmis les Sauce de l'hôte via son id
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'unauthorized request.'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {res.status(400).json({ error });
        });
};

exports.jaimeOuPasLaSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then((sauce) => {

        // Like
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {likes: 1},
                    $push: {usersLiked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "Le user aime la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
        if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "Le user n'aime plus la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };

        // Dislike
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "Le user deteste la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
        if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "Le user ne deteste plus la sauce"}))
            .catch(error => res.status(400).json({ error }));
        };
    })
    .catch(error => res.status(404).json({ error }));
}