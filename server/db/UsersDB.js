//load and cache mysql, brcypt modules
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const { resolve } = require('path');


// Establish and store the connection credentials
var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'testDB'
});


/* Validates the user login credentials and returns a promise
@return resolve, validates the user and sends completion promise to frontend
@return reject, invalidates the user and sends a rejection promise to frontend
*/ 

validateUser = (email, password) => {

    return new Promise((resolve, reject) => { 
         //LIMIT 1 - so you only get one result
        connection.query(`SELECT * FROM sampleAccts WHERE email = "${email}" LIMIT 1`, (err, results) => { 
            if (err) {
                return reject(err)
            }

            // if the DB returns a valid result and if the DB email = request email and if the DB pw = request pw
            if (results[0] != undefined && results[0].email == email ) {
                
                bcrypt.compare(password, results[0].password,  function (err, comparison) {
                   
                    if(comparison == true) {
                        resolve(true); 
                    }
                    else {
                        resolve(false);
                    }
                })
            }

            else {
                resolve(false); 
            }
        })
    })
}

/* Adds the user into the database
@return resolve, validates the user and sends completion promise to frontend
@return reject, invalidates the user and sends a rejection promise to frontend
*/ 
addUser = (username, password, email, id) => {
    console.log("Add new user UserDB\nuser: " + username + "\npass: " + password + "\nemail: " + email + "\nCWID: " + id);
    connection.query(`INSERT INTO sampleAccts (id, username, password, email) VALUES ("${id}", "${username}", "${password}", "${email}" )`);
}


viewAllUsers = () => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, username, email FROM sampleAccts `, (err, results) => { //Retrieve all the users
            if (err) {
                return reject(err)
            }
            // console.log("server results: " + JSON.stringify(results))
            resolve(results);
            return;
        })
    })
}

getScheduleInfo = (cwid) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT crn FROM Schedule WHERE Schedule.cwid = ${cwid}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0].crn);
            return;
        })
    }
    )
}


getAllClassInfo = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Classes`, (err, result) => {
            if(err) {
               return reject(err);
            }
            resolve(result);
            return;  
        })
    })
}

getAllClassInfo = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Classes`, (err, result) => {
            if(err) {
               return reject(err);
            }
            resolve(result);
            return;  
        })
    })
}

addClassToSchedule = (cwid, crn) => {
    return new Promise((resolve, reject) => {

        connection.query(`Select cwid FROM Schedule where cwid = ${cwid}`, (err, value) => {
            if(err){
                reject(err);
            }

            if(value.length == 0){
                connection.query(`INSERT INTO Schedule (cwid, crn) VALUES ("${cwid}", "${crn}-")`, (err, added) => {
                    if(err){
                        reject(err);
                    }
                    resolve(added);
                })
            }
            else { 
        
                connection.query(`update Schedule set crn = concat(crn, '${crn}-') where cwid = ${cwid}`, (err, update) => {
                if(err){
                    reject(err);
                }
                resolve(update);
            })
        }
        })
    })
}

removeClassFromSchedule = (cwid, crn) => {
    return new Promise((resolve, reject) => {
        
            connection.query(`update Schedule set crn = replace (crn, '${crn}-', '') where cwid = ${cwid}`, (err, update) => {
                if(err){
                    reject(err);
                }
                resolve(update);
            })
        
    })
}

exports.removeClassFromSchedule = removeClassFromSchedule;
exports.getAllClassInfo = getAllClassInfo;
exports.validateUser = validateUser;
exports.addUser = addUser;
exports.viewAllUsers = viewAllUsers;
exports.addClassToSchedule = addClassToSchedule;