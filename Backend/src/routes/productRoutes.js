const express = require('express');
const router = express.Router();
const {createProduct} = require('../controllers/productController')
const {isAdmin,isAuthenticated} = require('../middleware/authMiddleware')

router.post("/createProduct", isAuthenticated,isAdmin, createProduct)

module.exports = router;