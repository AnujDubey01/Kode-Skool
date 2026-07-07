const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_KEY';

const fetchUser = (req, res, next) => {
    let token = req.header('auth-token') || 0;
    
    try {
        if(!token){
            return res.status(400).send({msg: "User not logged in properly!"});
        }else{
            jwt.verify(token, JWT_SECRET, (error, data) => {
                if(error){
                    res.status(500).send({err: error});
                }else{
                    req.user = data.user;
                    next();
                }
            })
        }
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

module.exports = fetchUser;