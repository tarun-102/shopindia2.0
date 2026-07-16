const user = require('../models/userModel')

const registerUser = (req,res) => {

    const {name,email,password} = req.body

    if(!name || !email || !password){
      return res.status(400).json({
            success: false,
            message: "api feild required"
        })
    }
    res.status(200).json({
        success: true,
        message: "register api working"
    })
}

module.exports = {
    registerUser,
}