const jwt = require('jsonwebtoken');

// ================
//  TOKEN VERIFICATION
// ================
let verificatedToken = (req, res, next) => { // Si no llamas al next, no continua la ejecucion
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }
        req.user = decoded.user; // Obtener el payload del user
        next(); // Permitimos continuar
    });

};

// ================
//  TOKEN VALIDATION ROLE
// ================
let verificatedRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Permission Denied.'
            }
        });
    }
}

// ================
//  TOKEN VERIFICATION IMG
// ================
let verificatedTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }
        req.user = decoded.user; // Obtener el payload del user
        next(); // Permitimos continuar
    });;
}

module.exports = {
    verificatedToken,
    verificatedRole,
    verificatedTokenImg
}