require("dotenv").config()
//Mongo DB Atlas config and connect
const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI

mongoose.connect(URI, (err) => {
  err ? console.log("\033[31m " + err) : console.log("\033[32m  'Mongo Atlas connected ok'");
});