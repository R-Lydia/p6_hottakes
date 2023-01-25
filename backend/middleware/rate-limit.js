const rateLimit = require('express-rate-limit');

// limiter le nombre de requêtes pr login
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 		// 15 minutes
	max: 5, 						// Limit each IP to 5 requests per `window` (here, per 15 minutes)
    message : 'Trop de tentatives de connexion, votre accès sera bloqué pendant les 15 prochaines minutes',
	standardHeaders: true, 			// Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false 			// Disable the `X-RateLimit-*` headers
});

module.exports = limiter;