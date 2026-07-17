const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/Apierror");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
   throw new ApiError(400, "All feild required")
  }
  const existUser = await user.findOne({ email });

  if (existUser) {
   throw new ApiError(400, "user sllreadt exist")
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await user.create({
    name,
    email,
    password: hashPassword,
  });

  res.status(201).json({
    success: true,
    message: "user register successfully",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required")
  }

  const existUser = await user
    .findOne({ email })
    .select("+password +refreshToken");

  if (!existUser) {
    throw new ApiError(404, "user not register")
  }

  const isPasswordmatch = await bcrypt.compare(password, existUser.password);

  if (!isPasswordmatch) {
    throw new ApiError(401,"invalid email or password")
  }

  const accessToken = generateAccessToken(existUser);
  const refreshToken = generateRefreshToken(existUser);

  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
  existUser.refreshToken = hashRefreshToken;

  await existUser.save({ validateBeforeSave: false });

  const accessOptions = {
    httpOnly: true,
    secure: false,
    maxAge: 15 * 60 * 1000,
    sameSite: "strict",
  };

  const refreshOptions = {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  };

  return res
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .status(200)
    .json({
      success: true,
      message: "Login Successful",
      user: {
        id: existUser.id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role,
      },
    });
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  //chekc token exist
  if (!incomingRefreshToken) {
   throw new ApiError(401, "missing refresh token")
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const existUser = await user.findById(decoded.id).select("+refreshToken");

  if (!existUser) {
    throw new ApiError(404, "user not found")
  }
  const isRefreshTokenMatch = await bcrypt.compare(
    incomingRefreshToken,
    existUser.refreshToken,
  );

  if (!isRefreshTokenMatch) {
    throw new ApiError(401, "invalid refresh token")
  }

  const newAccessToken = generateAccessToken(existUser);
  const newRefreshToken = generateRefreshToken(existUser);

  const hashNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

  existUser.refreshToken = hashNewRefreshToken;

  await existUser.save({
    validateBeforeSave: false,
  });

  const accessOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  };

  const refreshOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .cookie("accessToken", newAccessToken, accessOptions)
    .cookie("refreshToken", newRefreshToken, refreshOptions)
    .status(200)
    .json({
      success: true,
      message: "token rereshed successfullly",
    });
});

const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    existUser: req.user,
  });
});

const logout = asyncHandler(async (req,res) => {
  const existUser = req.user;

  existUser.refreshToken = undefined;
  await existUser.save({
    validateBeforeSave: false,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.clearCookie(
    "accessToken",

    {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    },
  );

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = {
  registerUser,
  login,
  getProfile,
  refreshToken,
  logout,
};