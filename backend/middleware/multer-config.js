const multer = require('multer');

// dictionnaire mime-types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// on utilise diskStorage pour dire qu'on va l'enregistrer sur le disque, besoin de 2 éléments 
const storage = multer.diskStorage({
    // 1er élément, dans quel dossier
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // 2eme élément, quel nom de fichier
    filename: (req, file, callback) => {
        // spliter autour des espaces pour créer un tableau avec les différents mots du nom de fichier
        // et joiner le tableau en une seule string en utilisant les underscore
        const name = file.originalname.split(' ').join('_');
        // appliquer une extension au fichier en utilisant les mime-types
        const extension = MIME_TYPES[file.mimetype];
        // null = pas d'erreur et ensuite le nom avec un "marqueur de temps" (timestamp), un point et l'extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

// export du middleware multer : appel méthode multer à laquelle on passe l'objet storage
// appel méthode single pour spécifier qu'il s'agit d'un fichier unique et d'un fichier image
module.exports = multer({ storage }).single('image');