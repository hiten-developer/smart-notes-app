const  userModel = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signup = async(req,res) => {
    try{
        const {name,email,password} = req.body
        const findUser = await userModel.findOne({email})
        if(findUser){
            return res.status(400).json({
                message : "Email Already exists"
            })
        }
        const hashPass = await bcrypt.hash(password,10)
        await userModel.create({
            name : name,
            email : email,
            password : hashPass
        })

        res.status(201).json({
            message : "Signup Successfull"
        })

    }
    catch(err){
        return res.status(500).json({
            message : "Server Err",
            msg_det : err.message 
        })
    }
}

const login = async(req,res) => {
    try{
        const {email,password} = req.body
        const findUser = await userModel.findOne({email})
        if(!findUser){
            return res.status(404).json({
                message : "User Cannot Found!"
            })
        }
        const pass = await bcrypt.compare(password,findUser.password)
        if(!pass){
            return res.status(400).json({
                message : "Pasword Not Match try again..."
            })
        }
        const jwt_token = jwt.sign({id : findUser._id},process.env.JWT_SECRET,{expiresIn : '7d'})

        return res.status(200).json({
            token : jwt_token
        })
    }
    catch(err){
         return res.status(500).json({
            message : "Server Err",
            msg_det : err.message 
        })
    }
}

module.exports = {signup,login}