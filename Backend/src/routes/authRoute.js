const express =require('express');
const router = express.Router()
const {registerUser, login, getProfile} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post("/register",  registerUser);
router.post("/login", login);
router.get("/getprofile", isAuthenticated, getProfile)
module.exports = router;