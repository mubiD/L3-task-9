const express = require('express'); //Require express.
const app = express() //Store Expresses functionality in variable.
const serverFxn = require('../controllers/controllers.js'); //Require the functionality within controllers.js.

app.post("/addTask", serverFxn.create); //Create documents.

app.post("/getTasks", serverFxn.findAll); //Read documents from Main.js.

app.delete("/deleteTask", serverFxn.deleteTask); //Delete documents with deleteTask.

app.post('/login', serverFxn.loginUser); //Login user to application.

module.exports = app; //Exporting app an its methods ie post, put, get and delete.