// importer express
const express = require('express');
const mongoose = require('mongoose');
//const cors = require('cors');
const helmet = require('helmet');
// importer path pour accéder au path de notre serveur
const path = require('path');

// importer les routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// appel de la méthode pour créer une application express
const app = express();

// enlever le deprecationWarning
//mongoose.set('strictQuery', false);
// connexion mongoose
mongoose.connect('mongodb+srv://pyakoly:OfIabpp2RDIqjM4d@cluster0.yw8necf.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
 

// ajouter des headers pour gérer le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// accéder au corps de la requête, intercepte requêtes content-type json
app.use(express.json());

app.use(helmet());  
//app.use(cors());

// route attendue par le frontend 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// exporter application
module.exports = app;