// importer express pour créer un router
const express = require('express');
const router = express.Router();

const limiter = require('../middleware/rate-limit');

// associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// routes post pr signup et login
router.post('/signup', userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

// export du router
module.exports = router;
