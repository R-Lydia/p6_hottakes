// importer mongoose
const mongoose = require('mongoose');
// importer uniqueValidator
const uniqueValidator = require('mongoose-unique-validator');

// ajouter unique pour impossibilité connexion user plusieurs fois même email 
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// ajouter plugin uniqueValidator de mongoose pour éviter les bugs de mail unique
userSchema.plugin(uniqueValidator);

// export du modele
module.exports = mongoose.model('User', userSchema);