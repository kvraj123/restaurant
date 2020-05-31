var jwt = require('jsonwebtoken');
const User = require('../models/user')


const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode);
        const user = await User.findOne({_id: decode._id, 'tokens.token': token, email: 'poojarykaviraj7@gmail.com'})

        if(!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({error : 'please use admin credential'})
    }
}

module.exports = authAdmin;