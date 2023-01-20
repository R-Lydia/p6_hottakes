const Sauce = require('../models/Sauce');
const fs = require('fs');


// donner sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


// créer sauce
exports.createSauce = (req, res, next) => {
    // parser l'objet requête
    const sauceObject = JSON.parse(req.body.sauce);
    // supprimer de cet objet 2 champs 
    // car l'id de notre objet va être généré automatiqement par notre BDD
    delete sauceObject._id;
    // on va utiliser le token car on est sûr que c'est valide
    delete sauceObject._userId;
    // on créé notre objet
    const sauce = new Sauce({
        // avec ce qui nous a été passé moins les 2 champs supprimés
        ...sauceObject,
        // l'user ID on l'extrait de l'objet requête grâce au middleware
        userId: req.auth.userId,
        // générer l'URL de l'image car multer ne nous donne que le nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


// donner sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


// modifier sauce
exports.modifySauce = (req, res, next) => {
    // regarder s'il y a un champ file
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // s'il n'y a pas de champ file, on récupère la requête
    // par mesure de sécurité on supprime l'user ID
    delete sauceObject._userId;
    //pour vérifier si c'est bien l'user à qui appartient l'objet qui cherche à le modifier
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        // SI l'id de ce qu'on a récupéré de la BDD est différent de l'user ID qui vient du token
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé !' });
        // SINON c'est le bon user donc
        } else {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message : 'Sauce modifiée !' }))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};


// supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé !' });
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() =>  res.status(200).json({ message: 'Sauce supprimée !' }))
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));    
};


// liker ou disliker sauce
exports.likeSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        // SI like
        if (req.body.like == 1) { 
            sauce.usersLiked.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id }, {
                sauce,
                usersLiked: sauce.usersLiked,
                likes: sauce.usersLiked.length
            })
            .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            .catch(error => res.status(401).json({ error }));
        // SINON dislike        
        } else if (req.body.like == -1) { 
            sauce.usersDisliked.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id }, {
                sauce,
                usersDisliked: sauce.usersDisliked,
                dislikes: sauce.usersDisliked.length
            })
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch(error => res.status(401).json({ error }));
        // SINON neutre      
        } else if (req.body.like == 0) { 
            sauceLiked = sauce.usersLiked.indexOf(req.body.userId);
            sauceDisliked = sauce.usersDisliked.indexOf(req.body.userId);
            // SI dislike avant
            if (sauceLiked == -1) { 
                sauce.usersDisliked.splice(sauceDisliked, 1);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.usersDisliked.length
                })
                .then(() => res.status(200).json({ message: 'Sauce undislikée !' }))
                .catch(error => res.status(401).json({ error }));
            // SINON like avant        
            } else { 
                sauce.usersLiked.splice(sauceLiked, 1);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersLiked: sauce.usersLiked,
                    likes: sauce.usersLiked.length
                })
                .then(() => res.status(200).json({ message: 'Sauce unlikée !' }))
                .catch(error => res.status(401).json({ error }));
            }
        }
    })
    .catch(error => res.status(500).json({ error }));
};
