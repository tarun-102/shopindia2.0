const express =require('express');
const router = express.Router()
const {registerUser, login, getProfile,refreshToken, logout} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post("/register",  registerUser);
router.post("/login", login);
router.get("/getprofile", isAuthenticated, getProfile)

router.post("/refresh", refreshToken)
router.post("/logout", isAuthenticated,logout)
module.exports = router;