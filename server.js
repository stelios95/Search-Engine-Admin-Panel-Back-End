const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const getPwd = require("./databasePasswordFetch");
const seedRoute = require("./routes");
const User = require('./userSchema')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/seeds", seedRoute);
//get password for atlas DB from local file called databasePassword.txt
const pwd = getPwd();
const mongoURL =
  "mongodb+srv://admin:" +
  pwd +
  "@cluster0-jbfnp.mongodb.net/test?retryWrites=true&w=majority";

//connect to MongoDBo on Atlas
mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => {
    //connected
    console.log("Connected to Atlas DB for seeds")
    //createAdminUser()
  })
  .catch(error => {
    //db connection error
    console.log("ERROR: " + error);
  });

//server starts listening here
app.listen(PORT, function() {
  console.log("Server is running on Port:", PORT);
});


// function createAdminUser(){
//   const saltRounds = 10
//   try{
//     bcrypt.hash('ntinos', saltRounds, function(err, hash) {
//       // Store hash in your password DB.
//       const user = new User({
//         username: 'stelios',
//         password: hash
//       })
//     user.save()
//   })
//   } catch(err){
//     console.log(err)
//   }
}