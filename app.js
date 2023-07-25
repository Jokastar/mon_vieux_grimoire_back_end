const express = require("express");   
const mongoose = require("mongoose"); 
const bookRouter = require("./routes/bookRoutes");
const authRouter = require("./routes/authRoutes");
const cors = require("cors");
const path = require('path');
const app = express();
require("dotenv").config();


//connection to the db
mongoose.connect(`mongodb+srv://kevinlolaka:${process.env.MONGO_DB_PASSWORD}@mvg001.g2de9qz.mongodb.net/?retryWrites=true&w=majority`, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Successful connexion to Mongo Db"))
.catch((e) => console.log(e));

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization"
}
app.use(cors(corsOptions)); 
app.use('/images', express.static(path.join(__dirname, './images')));


// Login and signup routes
app.use("/api/auth", authRouter); 

// books CRUD routes
app.use("/api/books", bookRouter); 

module.exports = app; 