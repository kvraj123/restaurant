const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

// const { sendWelcomeEmail } = require('../emails/accounts')




const router = new express.Router()

router.post('/login/user', async (req, res) => {

    try {
        const user = await User.findUserByCredential(req.body.email, req.body.password);
        // sendWelcomeEmail(user.email, user.name)
        console.log(user)
        const token = await user.generateToken();
        // console.log(user)
        res.send({
            user,
            token
        });
    } catch (e) {
        res.status(505).send(e);
    }


})


router.post('/createUser', async (req, res) => {
    const create = new User(req.body);
   
    try {

        const user = await create.save();
        // sendWelcomeEmail(create.email, create.name)
        const token = await create.generateToken();
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/logout', auth , async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send(e)
    }
})


router.post('/logoutAll', auth , async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send(e)
    }
})


router.get('/getUsers/profile',auth, async (req, res) => {
  

    try {
        // const response = await User.find({});

        const response = req.user;
        res.send(response)
    } catch (e) {
        res.status(500).send(e.errors.name.message)
    }
})






router.patch('/updateUser/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'invalid update' })
    }

    try {
   

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete('/deleteUser/me',auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        await req.user.remove()
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})













module.exports = router