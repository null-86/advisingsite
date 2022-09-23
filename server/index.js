
//load and cache express. brcypt, cors, body-parser, UserDB modules
const express = require('express');
const bcrypt = require('bcrypt');
const app = express(); 
var cors = require("cors");
var bodyParser = require("body-parser");
var userDB = require('./db/UsersDB')

//Amount of rounds the password gets hashed
const saltRounds = 10;


//For integration(client to the apis) purpose
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//API for authenticating a user
app.get('/api/authUser/', async (req, res) => {
    //if username or password is empty
    if (!req.body.email || !req.body.password) {
        //400 is bad request code
        res.status(400).send("Username & Password is required");
        return;
    }

    //Validate user using userDB module's methods
    try {
        let validate = await userDB.validateUser(req.body.email, req.body.password); 
        res.json(validate); 
    }
    catch (e) {
        console.log(e)
    }

});


//API to add a user to database
app.post('/api/addUser/', async (req, res) => {
 
    try {
        let addUser = bcrypt.hash(req.body.password, saltRounds).then(hash => userDB.addUser(req.body.username, hash, req.body.email, req.body.id));
        res.json(addUser); 
    }
    catch (e) {
        console.log(e)
    }
});


//API to view all current users
app.get('/api/viewUsers/', async (req, res) => {

    try {
        let users = await userDB.viewAllUsers();
        res.json(users); 
    }
    catch (e) {
        console.log(e)
    }
});

//API to retrieve a student's schedule information
app.get('/api/scheduleInfo/', async(req, res) => {
    try {
        let info = await userDB.getScheduleInfo(req.body.cwid);
        res.json(info.split("-"));
    }
    catch(e){
        console.log(e);
    }
});


//API to retrieve all classes offered
app.get('/api/getAllClasses/', async(req, res) => {
    try {
        let classInformation = await userDB.getAllClassInfo();
        res.json(classInformation);//Array of row objects. do array[index].crn(or any other attribute) to access
    }
    catch(e){
        console.log(e);
    }
});


//API to add a class to schedule
app.post('/api/addClass/', async (req, res) => {
 
    try {
        let addClass = userDB.addClassToSchedule(req.body.cwid, req.body.crn);
        res.json(addClass); 
    }
    catch (e) {
        console.log(e)
    }
});


//API to remove a class from a schedule
app.post('/api/removeClass/', async (req, res) => {
 
    try {
        let removeClass = userDB.removeClassFromSchedule(req.body.cwid, req.body.crn);
        res.json(removeClass); 
    }
    catch (e) {
        console.log(e)
    }
});

const port = process.env.PORT || 8080; //If 8080 is unavailable, environment declares the port
app.listen(port, () => console.log(`Listening on port ${port}`));
