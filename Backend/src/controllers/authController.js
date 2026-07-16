const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken')

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

const login = async (req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        })
    }

    const existUser = await user.findOne({email}).select("+password")

    if(!existUser){
        return res.status(404).json({
            success: false,
            message: "invaild email or password"
        })
    }

    const isPasswordmatch = await bcrypt.compare(
        password,
        existUser.password
    )

    if(!isPasswordmatch){
        return res.status(401).json({
            success: false,
            message: "invaild email or password"
        })
    }

    const token = jwt.sign(
        {
            id: existUser._id,
            role: existUser.role
        },

        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    )
    const option = {
        httpOnly: true,
        secure: false,
        maxAge: 24  * 60 * 60 *1000,
    }

    return res
    .cookie("token", token, option)
    .status(200)
    .json({
        success: true,
        message: "Login Successful",
        user: {
            id: existUser.id,
            name: existUser.name,
            email: existUser.email,
            role: existUser.role
        }
    });
}

const getProfile = async (req,res) => {
    return res.status(200).json({
        success: true,
        existUser: req.user
    })
}

module.exports = {
    registerUser,
    login,
    getProfile,
}