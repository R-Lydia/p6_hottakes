// importer bcrypt
const bcrypt = require('bcrypt');
//importer jsonwebtoken
const jwt = require('jsonwebtoken');

// importer model user
const User = require('../models/User');


// inscrire user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    // enregistrer hash du password,  enregistrer nouveau user
    .then(hash => {        
        // création nouvel user avec modèle mongoose
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// connecter user sans jsonwebtoken
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ message: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                   { userId: user._id },
                   'RANDOM_TOKEN_SECRET', 
                   { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
 };


/*
// connecter user avec jsonwebtoken
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        // si l'utilisateur n'existe pas
        if(user === null) {
            // on reste flou sur le message d'erreur pour ne pas dire si l'user existe ou pas, sinon c'est déjà une fuite de données
            res.status(401).json({ message: 'Identifiant/mot de passe incorrect'})
        // sinon il existe    
        } else {
            // on compare le password de la BDD avec celui qui nous a été transmis (méthode compare de bcrypt)
            // c'est une promesse qui nous est retournée donc then et catch
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // si le mot de passe n'est pas valide
                if(!valid){
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'}) 
                // sinon il est valide    
                } else {
                    // on renvoit un code 200 avec 
                    //un objet qui va contenir les informations nécessaires à l'authentification des requêtes émises par notre client :
                    // un user ID et un TOKEN (token qui était codé en dur pour 1er test) et qu'on remplace par une fonction de jsonwebtoken
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            // 1er argument qu'on veut encoder ici l'user ID (comme ça on est sûr que l'user ID de la reqête correspond)
                            // 2è argument , c'est la clé secrète pour l'encodage (là c'est juste pour ex pour le developpement, 
                            // en vrai pour la production, il faudrait mettre une chaîne de caractères bcp plus longue et plus aléatoire pour sécuriser l'encodage)
                            // 3è argument, c'est un argument de configuration où on donne une expiration pour le token
                            {  userId: user._id}, 
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            // erreur de traitement et non une erreur liée à un mauvais mot de passe
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};*/