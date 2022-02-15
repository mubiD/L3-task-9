const express = require('express') //Require express.
const mongoose = require('mongoose'); //Require Mongoose
const app = express() //Store Expresses functionality in variable.
const Users = require('../models/modelsnew'); //Require the Schema sent from models.js
const jwt = require('jsonwebtoken') //Require jwt module.

const bodyParser = require('body-parser'); // Allows us access to the req.body object.
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); //converts everything that is being sent back to react to JSON(It stringifys whatever is being sent eg. res.json({"item": webProjectArr})).

const verify = async (req, res) =>{
    const auth = req.body.jwt; //The token is stored in state and is sent with the init object.
    console.log(`${auth} - line 13 controllers.js` ); 
    try{
        const decoded = jwt.verify(auth, 'ALDAANGEL') //The jwt is verified with the secret key(second parameter) | jwt stored in auth
        console.log(decoded.id) //
        return decoded.id; //returns the user._id
    }catch (err) {
        return false //Return false 
    }
}

//Create a TASK for the TODO list.
exports.create = async (req, res) => {
    const ver = await verify(req, res); //Returns the decoded id from the jwt payload(decoded.id)
    if(ver){ //If the user is verified (Authenticated and Authorized)
        try {
            const item = await Users.findById({_id: ver}); //Find a user in the db the matches the decoded id from the payload.
            const taskArr = item.tasks; //Store the tasks from this founded user in a variable
            taskArr.push(req.body.userInput) //Push a task(that is sent from the frontend) into the tasksarray within the db.
            await Users.findByIdAndUpdate({ _id: ver } ,{$set: {tasks: taskArr}}) //Update the db with the updated tasks array
            res.send(taskArr); //Send the relevant information back to the frontend.
        } catch(error) {
                console.log(error);
                res.send({ message: `Could not create new Todo: ${error}!` }); //Error.
            }
    }
};

// Find all tasks in the db for that particular user.
exports.findAll = async (req, res) => {
    const ver = await verify(req, res); //Returns the decoded id from the jwt payload(decoded.id)
    console.log(ver);
    if(ver){ //If the user is verified (Authenticated and Authorized)
        try{
            const item = await Users.findById({_id: ver}); //Find a user in the db the matches the decoded id from the payload.
            console.log(item)
            res.send(item.tasks); //Send all the tasks back to the user(frontend).
        } catch(error){
            res.send({ message: `Retrieval failed: ${error}!` }) //Error.
            console.log(error); 
        }
    }
}

//Delete a particular task for a user using IDs.
exports.deleteTask = async (req, res) => {
    const ver = await verify(req, res); //Returns the decoded id from the jwt payload(decoded.id)
    if(ver){ //If the user is verified (Authenticated and Authorized)
        try{
            const item = await Users.findById({_id: ver}); //Find a user in the db the matches the decoded id from the payload.
            const taskArr = item.tasks; //Store the tasks from this founded user in a variable
            taskArr.splice(req.body.updateId, 1) //Delete item from the array.
            await Users.findByIdAndUpdate({ _id: ver } ,{$set: {tasks: taskArr}})  //Update the db with the updated tasks array
            res.send(taskArr); //Send the relevant information back to the frontend.
        } catch(error){
            res.send({ message: `Retrieval failed: ${error}!` }) //Error.
            console.log(error);  
        }
    }
}

exports.loginUser = async (req, res) => {
    
    const username = req.body.username; //Store the username that has been sent from the frontend
    const password = req.body.password; //Store the password that has been sent from the frontend
    
    // findOne is what is needed to search through the db.
    const user = await Users.findOne({username : username}); 

    console.log(`${user} ${user.username} - line 79 controllers.js`);
    console.log(`${username} ${password} - line 80 controllers.js`);
    
    if(username === user.username && password === user.password){ //Checking to see if the users username and password matches the information in the db, if so, run block.
        // The purpose of the null condition is to check if the findOne method actually returned 'something' from the mongoDB db. ***** NB ***** 
        payload = {
            'name' : username, //Username intialized in the frontend.
            'id' : user._id //Users id from document within the db.
        }
        // CHANGE THIS CODE LINE 87
        // const token = jwt.sign(JSON.stringify(payload), 'ALDAANGEL', {algorithm: 'HS256'}); //create the JWT.
        console.log(`${payload} from line 90 controllers.js`)
        const token = jwt.sign(JSON.stringify(payload), 'ALDAANGEL', {algorithm: 'HS256'}); //create the JWT.

        console.log('works and here is the db info:' + token, user.username, user._id)
        console.log(`${token} from line 93 controllers.js`);
        
        res.send({'token': token}) // Send the token back to the frontend.
    }else{
        console.log("invalid - line 97 controllers.js");
        res.status(403).send({"err" : "Incorrect login!"})
    }
} 