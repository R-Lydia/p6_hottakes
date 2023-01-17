// importer express et créer un router
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');


// route GET = toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// route POST sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// route GET = une sauce 
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route PUT = modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route DELETE = supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//route POST = (dis)liker sauce
//router.post('/:id/like', auth, saucesCtrl.likeSauce);

// export du router
module.exports = router;
