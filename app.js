const express = require('express') //Require express.
const app = express() //Store Expresses functionality in variable.
const mongoose = require('mongoose'); //Require Mongoose.

const bodyParser = require('body-parser'); // Allows us access to the req.body object.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //converts everything that is being sent back to react to JSON(It stringifys whatever is being sent eg. res.json({"item": webProjectArr})).
app.use(express.urlencoded({ extended: false })) // So that our req.body can contain values that are either strings and arrays.

//const helmet = require("helmet"); //Require Helmet
//app.use(helmet());

const routes = require('./routes/requests.js'); //Require routes from ./routes/requests.js.
app.use('/', routes); //attaching the functionality within routes/requests.js to the express server(This is for route handling ie the '/')

const uri = 'mogodb+srv//dbUser1:mubashirD!@cluster0.893xc.mongodb.net/task9?retryWrites=true&w=majority';
mongoose.Promise = global.Promise; 
// Nodes Promise property within the global object equals mongoose's Promise property.
// If we want to use mongoose in different position inside the code it must be viewed as global mode, that's why we need to set mongoose as : mongoose.Promise = global.Promise; 

mongoose.connect('mongodb+srv://dbUser1:mubashirD!@cluster0.893xc.mongodb.net/',{
    dbName: 'task9' // Connect to the task9 db.
}).then( result => {
    console.log('database connected!');
}).catch(err => console.log(`${err} failed to connect at line 30 app.js`));

const db = mongoose.connection; //Store mongoose.connection inside db variable.

//Port listening at:
const PORT = process.env.PORT || 3002;

db.once('open', function() {
    console.log("Successfully connected to the database");

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
    
});

db.on('error', function() {
	console.log('Could not connect to the database. Exiting now...');
    process.exit(); 
});