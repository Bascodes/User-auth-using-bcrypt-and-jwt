const router = require ('express'). Router();
const User =require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//const Joi = require('@hapi/joi')
//const schema = {
    //name:Joi.string().min(6).required(),
    //email:Joi.string().min(6).required().email(),
    //password:Joi.string().min(6).required()}




router.post('/register', async (req, res) => {

   // const { error } = Joi.validate(req.body, schema)
    //if (error) return res.status(400).send (error.details[0].message)


    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exists!')


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)






    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: user._id})
    }
    catch(err){
        res.status(400).send(err)
    }
})


router.post('/login', async(req, res) =>{

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email doesnt exists!')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid Password')


    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth_token',token).send(token)

    res.send('logged in!')


})


module.exports = router;
