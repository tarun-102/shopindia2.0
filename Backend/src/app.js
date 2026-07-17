const express = require('express')
const authRoute = require('./routes/authRoute')
const productRoutes = require('./routes/productRoutes');
const errorMiddleware = require("./middleware/errorMiddleware")
const app = express()
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoute)
app.use('/api/products', productRoutes)

app.use(errorMiddleware)
module.exports = app;