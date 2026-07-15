const app = require("./src/app")
require('dotenv').config()
const connectTodatabase = require("./src/config/db")
const port = process.env.PORT;

connectTodatabase();

app.listen(port, () =>{
    console.log(`server is running on port ${port}` )
})
