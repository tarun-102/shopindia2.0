const express = require('express')
const authRoute = require('./routes/authRoute')
const productRoutes = require('./routes/productRoutes');
const app = express()
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoute)
app.use('/api/products', productRoutes)

module.exports = app;