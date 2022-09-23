

const express = require('express');
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const app = express(); //has http requests like get, post, put, delete
var cors = require("cors");
var bodyParser = require("body-parser");
var userDB = require('./db/userDB');
var apptDB = require('./appt/AppointmentDB');
const saltRounds = 10; //Amount of rounds the password gets hashed


app.use(cors()); // needed to est connection to server with APIs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'testDB'
});

///'/' represents root of the website
app.get('/', (req, res) => {
    res.send('Hello World');
});


//API for authenticating a user
app.post('/api/authUser/', async (req, res) => {
    //if username or password is empty
    if (!req.body.email || !req.body.password) {
        //400 is bad request code
        res.status(400).send("Username & Password is required");
        return;
    }

    try {
        let validate = await userDB.validateUser(req.body.email, req.body.password); //make a new function in order to use await
        //console.log("validate: ", validate);
        res.json(validate); //sends validate promise in JSON format
    }
    catch (e) {
        console.log(e)
    }

});

app.post('/api/getStudentList', async (req, res) => {
    try {
        let user = await userDB.getStudentList(req.body.id); //make a new function in order to use await
        res.json(user);
    }
    catch (e) {
        console.log(e)
    }
});

app.post('/api/getAdvisor/', async (req, res) => {
    try {
        let info = await userDB.getAdv(req.body.cwid);
        res.json(info);
    }
    catch (e) {
        console.log(e);
    }
});

// app.post('/api/getAdvisor1/', async (req, res) => {
//     try {
//         let info = await userDB.getAdv1(req.body.cwid);
//         res.json(info);
//     }
//     catch (e) {
//         console.log(e);
//     }
// });


app.get('/api/viewUsers/', async (req, res) => {

    try {
        let users = await userDB.viewAllUsers(); //make a new function in order to use await
        // console.log(users);
        res.json(users);
    }
    catch (e) {
        console.log(e)
    }
});


//API to retrieve a student's schedule information
app.post('/api/scheduleInfo/', async (req, res) => {
    try {
        let info = await userDB.getScheduleInfo(req.body.cwid);
        res.json(info);
    }
    catch (e) {
        console.log(e);
    }
});


//API to retrieve all classes offered
app.get('/api/getAllClasses/', async (req, res) => {
    try {
        let classInformation = await userDB.getAllClassInfo();
        res.json(classInformation);//Array of row objects. do array[index].crn(or any other attribute) to access
        console.log("getallclasses api: " + (res))
    }
    catch (e) {
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

app.post('/api/getAgreement/', async (req, res) => {
    try {
        let info = await userDB.getConfirmation(req.body.cwid, req.body.acctType);
        res.json(info);
    }
    catch (e) {
        console.log(e);
    }
});

//API to save users confirmation on schedule
app.post('/api/changeAgreement/', async (req, res) => {

    try {
        let changeConfirm = userDB.changeConfirmation(req.body.cwid, req.body.acctType);
        res.json(changeConfirm);
    }
    catch (e) {
        console.log(e)
    }
});


app.post('/api/getAdvisor/', async (req, res) => {
    try {
        let info = await userDB.getAdv(req.body.cwid);
        res.json(info);
    }
    catch (e) {
        console.log(e);
    }
});


////// folowing code is used for appointment api

// // get advisor free time
// app.post('/api/getAdvisorFreetime/', async (req, res) => {

//     try {
//         let val = await getAdvisorFreetime(req.body.advisorCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime);
//         res.json(val);
//     }
//     catch (e) {
//         console.log(e);
//     }

// });

// // assign a student to an available appointment
// app.post('/api/getSharedAppointments/', async (req, res) => {

//     try {

//         let val = await getSharedAppointments(req.body.advisorCwid, req.body.studentCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime);
//         res.json(val);
//     }
//     catch (e) {
//         console.log(e);
//     }

// });

// // assign a student to an available appointment
// app.post('/api/getStudentAppointments/', async (req, res) => {

//     try {
//         let val = await getStudentAppointments(req.body.studentCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime);
//         res.json(val);
//     }
//     catch (e) {
//         console.log(e);
//     }

// });



// // set available freeTime
// app.post('/api/setAdvisorFreetime/', async (req, res) => {


//     try {
//         let val = await setAdvisorFreetime(req.body.advisorCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime);
//         res.json(val);
//     }
//     catch (e) {
//         console.log(e);
//     }

// });

// assign a student to an available appointment
app.post('/api/getAdvisorAppointments/', async (req, res) => {

    try {
        let val = await getAdvisorAppointments(req.body.advisorCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime); //make a new function in order to use await
        res.json(val);
    }
    catch (e) {
        console.log(e)
    }

});

// assign a student to an available appointment
app.post('/api/assignStudentToAppointment/', async (req, res) => {

    try {
        let val = await assignStudentToAppointment(req.body.studentCwid, req.body.id);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }

});

// unassign a student from appointment
app.post('/api/unassignStudentFromAppointment/', async (req, res) => {

    try {
        let val = await unassignStudentFromAppointment(req.body.studentCwid, req.body.id);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }

});


// get advisor appointments within a date range
app.post('/api/getAdvisorAppointmentsByDateRange/', async (req, res) => {

    try {
        let val = await getAdvisorAppointmentsByDateRange(req.body.advisorCwid, req.body.startDateStr, req.body.endDateStr); //make a new function in order to use await
        res.json(val);
    }
    catch (e) {
        console.log(e)
    }

});

// get student appointments (and empty appointments withing a date range)
app.post('/api/getStudentAvailableAppointmentsByDateRange/', async (req, res) => {

    try {
        let val = await getStudentAvailableAppointmentsByDateRange(req.body.advisorCwid, req.body.studentCwid, req.body.startDateStr, req.body.endDateStr); //make a new function in order to use await
        res.json(val);
    }
    catch (e) {
        console.log(e)
    }

});

// create an available appointment
app.post('/api/setAvailableAppointment/', async (req, res) => {

    try {
        let val = await setAvailableAppointment(req.body.advisorCwid, req.body.yr, req.body.mnth, req.body.dayNum, req.body.startTime, req.body.endTime, req.body.location);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }

});

// create an available appointment
app.post('/api/getName/', async (req, res) => {

    try {
        let val = await getName(req.body.cwid);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }

});

// delete a timeSlot (freetime or appt)
app.post('/api/deleteTimeSlot/', async (req, res) => {


    try {
        let val = await deleteTimeSlot(req.body.id);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }

});


app.post('/api/classAgreements/', async (req, res) => {
    try {
        let val = await classAgreements(req.body.cwid);
        res.json(val);
    }
    catch (e) {
        console.log(e);
    }
})

const port = process.env.PORT || 8080; //this is, if the running environment hasn't declared the port number, 8080 will be default
app.listen(port, () => console.log(`Listening on port ${port}`));
