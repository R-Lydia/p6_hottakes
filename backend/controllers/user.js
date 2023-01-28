require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
// importer model user
const User = require('../models/User');

// créer password plus fort
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have 1 uppercase letter
.has().lowercase()                              // Must have 1 lowercase letter
.has().digits()                                // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


// inscrire user
exports.signup = (req, res, next) => {
    // SI password non valide
    if (!passwordSchema.validate(req.body.password)) {
          return res.status(400).json({ message: 'Votre password doit avoir au minimum 8 caratères dont 1 majuscule, 1 minuscule et 1 chiffre' }); 
    } // SINON password valide
    else if (passwordSchema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
        // enregistrer hash du password pr nouveau user
        .then(hash => {        
            // créer nouvel user avec modèle mongoose
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error, message: 'Erreur création utilisateur' }));
    };    
};


// connecter user avec jsonwebtoken
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        // SI l'user n'existe pas
        if(!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }
        // sinon on compare le password de la BDD avec celui qui nous a été transmis
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // SI le mot de passe n'est pas valide
            if(!valid) {
                return res.status(401).json({ message: 'Mot de passe incorrect !' });
            }
            // sinon on renvoit une réponse 200 avec un objet contenant l'user ID et le token
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                   { userId: user._id },
                   process.env.SECRET_TOKEN, 
                   { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
 };
