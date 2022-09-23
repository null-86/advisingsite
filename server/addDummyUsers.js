//load and cache mysql, brcypt, readline modules
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const { read } = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//Amount of rounds the password gets hashed
const saltRounds = 10;

// Establish and store the connection credentials
var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'testDB'
});

readline.question('Enter Id,username,pw,email?(in csv format)', (answer) => {
    var row = answer.split(',');
    bcrypt.hash(row[2], saltRounds).then(hash =>
         connection.query(`INSERT INTO sampleAccts (id, username, password, email) VALUES ("${row[0]}", "${row[1]}", "${hash}", "${row[3]}" )`));
});



