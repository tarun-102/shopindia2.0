const express = require('express');
const router = express.Router();

const {isAdmin,isAuthenticated} = require('../middleware/authMiddleware')