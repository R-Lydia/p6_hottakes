require('dotenv').config();

// importer jsonwebtoken
const jwt = require('jsonwebtoken');

// export du middleware pr extraire les infos du token et les transmettres aux autres middlewares ou routes
module.exports = (req, res, next) => {
    try {
        // récupérer le token dans le header et le spliter
        const token = req.headers.authorization.split(' ')[1];
        // décoder le token grâce à la méthode verify de jwt
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // récupérer l'user ID dans le token décodé
        const userId = decodedToken.userId;
        // ajouter à l'objet requête qui sera transmis aux routes ensuite
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};