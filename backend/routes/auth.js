const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).send('Invalid Token');
    }
    else{
        try {
            verifiedToken = jwt.verify(token,process.env.passWord);
            req.token = verifiedToken._id;
            next();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

module.exports = auth;