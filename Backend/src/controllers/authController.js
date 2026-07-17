const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "api feild required",
    });
  }
  const existUser = await user.findOne({ email });

  if (existUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
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
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const existUser = await user
    .findOne({ email })
    .select("+password +refreshToken");

  if (!existUser) {
    return res.status(404).json({
      success: false,
      message: "invaild email or password",
    });
  }

  const isPasswordmatch = await bcrypt.compare(password, existUser.password);

  if (!isPasswordmatch) {
    return res.status(401).json({
      success: false,
      message: "invaild email or password",
    });
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
};

const refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    //chekc token exist
    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "refresh token missing",
      });
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const existUser = await user.findById(decoded.id).select("+refreshToken");

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const isRefreshTokenMatch = await bcrypt.compare(
      incomingRefreshToken,
      existUser.refreshToken,
    );

    if (!isRefreshTokenMatch) {
      return res.status(401).json({
        success: false,
        message: "invalid refresh token",
      });
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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "invalid or expire refresh token",
    });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    existUser: req.user,
  });
};

const logout = async (req, res) => {
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
};

module.exports = {
  registerUser,
  login,
  getProfile,
  refreshToken,
  logout,
};
