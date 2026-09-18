const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Acesso negado. Token não fornecido.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (erro) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Token inválido ou expirado.'
        });
    }
};

module.exports = { verificarToken };
