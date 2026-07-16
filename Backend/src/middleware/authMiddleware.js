const jwt = require("jsonwebtoken");
const user = require("../models/userModel")
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const currentUser = await user.findById(decoded.id);

req.user = currentUser;
    next();
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
     return res.status(401).json({
        success: false,
        message: "Invalid or Expired Token"
    });
  }
};

module.exports = {
    isAuthenticated
};