const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_KEY';

const authMiddleware = (req, res, next) => {
    let token = req.header('auth-token');
    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            token = req.headers.authorization;
        }
    }

    try {
        if (!token) {
            return res.status(400).send({ msg: "User not logged in properly!" });
        } else {
            jwt.verify(token, JWT_SECRET, (error, data) => {
                if (error) {
                    return res.status(500).send({ err: error });
                } else {
                    req.user = data.user;
                    next();
                }
            });
        }
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
};

module.exports = authMiddleware;
