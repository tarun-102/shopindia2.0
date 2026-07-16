const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true,
    },
    description : {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Books", "Men", "women", "Furniture", "Accessories", "Fastion","Home", "Sports" ]
    },
    brand: 
        {
        type: String,
        required: true,
        trim: true
    },
    

    stock : {
        type: Number,
        required: true,
        min: 0
    },

    images : [
        {
        type: String,
        required: true
    }
    ],

    ratings :{
        type: Number,
        default: 0
    },

    numberOfReviews: {
        type: Number,
        default: 0
    },

    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}

},{
    timestamps: true
} )

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product;