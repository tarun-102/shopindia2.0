const express = require('express')
const authRoute = require('./routes/authRoute')
const app = express()
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoute)
module.exports = app