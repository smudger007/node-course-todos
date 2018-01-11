var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    console.log('Authenticating: Token is ', token)

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();  // i.e. reject case below....
        }

        req.user = user;
        req.token = token;
        next();

    }).catch((e) => {
        res.status(401).send();     // 401 - Auth Issue
    })

};

module.exports = { authenticate };
