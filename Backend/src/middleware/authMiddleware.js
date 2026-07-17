const jwt = require("jsonwebtoken");
const user = require("../models/userModel")
const isAuthenticated = async (req, res, next) => {
  try {
    const accesstoken = req.cookies.accessToken;

    if (!accesstoken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }
    
    const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);

   const currentUser = await user.findById(decoded.id);

   if (!currentUser) {
    return res.status(401).json({
        success: false,
        message: "User not found",
    });
}

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

const isAdmin = async (req,res,next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({
            success: false,
            message: "Access Denied"
        })
    }
    next()
}

module.exports = {
    isAuthenticated,
    isAdmin
};