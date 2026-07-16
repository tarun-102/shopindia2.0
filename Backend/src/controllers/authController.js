const user = require('../models/userModel')
const bcrypt = require('bcrypt');

const registerUser = async (req,res) => {

    const {name,email,password} = req.body

    if(!name || !email || !password){
      return res.status(400).json({
            success: false,
            message: "api feild required"
        })
    }
    const existUser = await user.findOne({email})

    if (existUser) {
    return res.status(409).json({
        success: false,
        message: "User already exists"
    });
}

    const hashPassword = await bcrypt.hash(password,10)

    const newuser  = await user.create({
        name,
        email,
        password: hashPassword
    });

    res.status(200).json({
        success: true,
        message: "user register successfully"
    })
}

module.exports = {
    registerUser,
}