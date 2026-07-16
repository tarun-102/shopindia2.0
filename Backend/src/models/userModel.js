const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        lowwercase:true,
        trim: true,
        unique:true
    },

    password: {
        type: String,
        required: true,
        minlength:6,
        select: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }
},  
    {
        timestamps: true
    }
)

const user = mongoose.model("user", userSchema)
module.exports = user;