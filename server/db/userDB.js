
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const { resolve } = require('path');
const saltRounds = 10; //Amount of rounds the password gets hashed
var term = 'Fall2020';
// var term = 'Spring2021';
// Establish and store the connection credentials
var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'tre_database'
});

test = () => {
    return new Promise((resolve, reject) =>
        connection.query('SELECT * FROM tre_database.endUser;', (err, result) => {
            // console.log(result);
            if (err) { return reject(err); }

            return resolve(result);
        })

    )
}
exports.test = test;


validateUser = (email, password) => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT e.cwid, email, fName, lName, acctType, CONVERT (password using utf8) AS password FROM tre_database.endUser as e 
                            join tre_database.account as a on e.cwid = a.cwid
                                join tre_database.accountCategory as aa on a.cwid = aa.cwid
                                    where e.email = '${email}';`, (err, results) => {

            if (err) {
                return reject(err)
            }

            if (results.length == 0) {
                resolve(false);
                return;
            }


            // if the DB returns a valid result and if the DB email = request email and if the DB pw = request pw
            if (results[0].email == email) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                 
                    if (result == true) {
                        console.log(`${email} logged in successfully`);
                        resolve(results); //resolve - makes db response usable for frontend
                    }
                    else {
                        resolve(false);
                    }
                })
            }

            else {
                console.log("Invalid User")
                resolve(false); //reject - tells frontend that the db results are bad, also invalidates the user, noice
            }
        })
    })
}



// getUserDetails = (email) => {

//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT id, email, acctType FROM sampleAccts WHERE email="${email}" LIMIT 1`, (err, results) => { //Retrieve all the users
//             if (err) {
//                 return reject(err)
//             }
//             console.log("server results: " + JSON.stringify(results))
//             resolve(results);
//             return;
//         })
//     })
// }
getAdv = (cwid) => {
    return new Promise((resolve, reject) => {

        connection.query(`SELECT advisorCwid  FROM tre_database.advisorAdvisee where studentCwid = '${cwid}' and term = '${term}';`, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if(result.length == 0) {
                reject(err);
                return;
            }
            //console.log(result[0].advisorCwid);
            resolve(result[0].advisorCwid);
            return;
        })

    })
}
// getAdv1 = (cwid) => {
//     return new Promise((resolve, reject) => {

//         connection.query(`SELECT a.advisorCwid, CONCAT(b.fName," " , b.lName) as advisorName  FROM tre_database.advisorAdvisee a  join tre_database.endUser b on a.advisorCwid = b.cwid where a.studentCwid = '${cwid}' and a.term = '${term}';`, (err, result) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             if(result.length == 0) {
//                 reject(err);
//                 return;
//             }
//             //console.log(result[0].advisorCwid);
//             resolve(result[0].advisorName);
//             return;
//         })

//     })
// }


getStudentList = (advID) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT aa.studentCwid, concat(e.fName, ' ', e.mInit, ' ', e.lName) as username, e.email FROM tre_database.advisorAdvisee as aa 
                            join tre_database.endUser as e on aa.studentCwid = e.cwid 
                                where aa.advisorCwid = '${advID}';`, (err, results) => {
            if (err) {
                return reject(err)
            }
            if(results.length == 0) {
                reject(err);
                return;
            }
            resolve(results);
            return;
        })
    })
}

getScheduleInfo = (cwid) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT crn from tre_database.classSchedule as c 
                            join tre_database.studentToSchedule as s on c.scheduleId = s.scheduleId 
                                where s.studentCwid = '${cwid}' and term = '${term}';`, (err, result) => {
            if (err) {
                return reject(err);
            }
            if(result.length == 0) {
                reject(err);
                return;
            }

            var crns = result.map((item) => {
                return item['crn'];
            })
            resolve(crns);
            return;
        })
    })
}

getAllClassInfo = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT c.subject as subj, c.courseNum as course, c.title, cs.crn, ss.location as classRoom, ss.weekDays as dayOfClass, CONCAT(time_format(ss.startTime, "%h:%i%p"),'-', time_format(ss.endTime, "%h:%i%p")) as timeOfDay, ss.instructor, c.creditHrsMin, c.creditHrsMax, bi.Max, bi.Enrolled from tre_database.course as c 
                            join tre_database.courseSection as cs on c.subject = cs.subject and c.courseNum = cs.courseNum 
                                join tre_database.sectionSetting as ss on cs.crn = ss.crn 
                                 join tre_database.BannerInfo as bi on bi.CRN = cs.crn;`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
            return;
        })
    })
}

addClassToSchedule = (cwid, crn) => {
    return new Promise((resolve, reject) => {

        connection.query(`Select scheduleId FROM tre_database.studentToSchedule 
                            where studentCwid = '${cwid}' and term = '${term}';`, (err, value) => {
            if (err) {
                reject(err);
                return;
            }

            if (value.length == 0) {
                connection.query(`INSERT INTO tre_database.studentToSchedule (studentCwid, term) VALUES ('${cwid}', '${term}');`, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    connection.query(`SELECT LAST_INSERT_ID() as scheduleId;`, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        connection.query(`INSERT IGNORE into tre_database.classSchedule VALUES ('${result[0].scheduleId}', '${crn}')`, (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            connection.query(`INSERT IGNORE into tre_database.scheduleAgreement (scheduleId) values ('${result[0].scheduleId}');`, (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                                return;
                            })
                        })
                    })
                })
            }
            else {
                connection.query(`INSERT IGNORE into tre_database.classSchedule VALUES ('${value[0].scheduleId}', '${crn}')`, (err) => {
                    if (err) {
                        reject(err);
                        return;

                    }
                    resolve();
                    return;
                })
            }
        })
    })
}

removeClassFromSchedule = (cwid, crn) => {
    return new Promise((resolve, reject) => {

        connection.query(`DELETE FROM tre_database.classSchedule where crn = '${crn}' and scheduleId = (
                            SELECT scheduleId FROM tre_database.studentToSchedule WHERE studentCwid = '${cwid}' and term = '${term}'
                        )`, (err, id) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
            return;
        })

    })
}

getAdv = (cwid) => {
    return new Promise((resolve, reject) => {

        var query = `SELECT advisorCwid FROM tre_database.advisorAdvisee where studentCwid = '${cwid}' and term = '${term}';`
        connection.query(query, (err, result) => {
            if (err) {
                reject(err);
                console.log("Student has not been assigned an advisor for this term");
                return;
            }
            if (result[0]) {
                // console.log(result[0].advisorCwid);
                resolve(result[0].advisorCwid);
            }
            
            resolve("Student has not been assigned an advisor for this term");
            return;
        })

    })
}
// ${type}

getConfirmation = (cwid, acctType) => {
    // var type = (acctType == 'Student' || acctType == 'student') ? 'studentAgree' : 'advisorAgree';

    return new Promise((resolve, reject) => {
        connection.query(`SELECT studentAgree, advisorAgree from tre_database.scheduleAgreement WHERE scheduleId = (
                            SELECT scheduleId FROM tre_database.studentToSchedule WHERE studentCwid = '${cwid}' and term = '${term}'
                        );`, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if(result.length == 0) {
                reject(err);
                return;
            }
            resolve(result[0]);
            return;
        })

    })
}


changeConfirmation = (cwid, acctType) => {
    var type = (acctType == 'Student' || acctType == 'student') ? 'studentAgree' : 'advisorAgree';
    
    return new Promise((resolve, reject) => {
       
        connection.query(`UPDATE tre_database.scheduleAgreement SET ${type} = NOT ${type} WHERE scheduleId = (
                             SELECT scheduleId FROM tre_database.studentToSchedule  WHERE studentCwid = ${cwid} and term = '${term}');`,
                             (err) => {

                                if (err) {
                                    
                                    reject(err);
                                    return;
                                }
                            
                                resolve();
                                return;
        })

    })
}



freeApt = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT startDate, endDate, title FROM testDB.FREE_APPOINTMENTS;`, (err, results) => {
            if (err) { reject(err) }
            console.log(results);
            resolve(results);
        })
    })

}


classAgreements = (cwid) => {
   
    return new Promise((resolve, reject) => {

        connection.query(`SELECT a.term, b.crn, d.courseNum, d.subject, e.title, e.creditHrsMax, e.creditHrsMin, f.instructor, concat(h.fName, ' ', h.lName) as advisorName, h.email FROM tre_database.studentToSchedule as a 
                            join tre_database.classSchedule b on a.studentCwid = '${cwid}' and a.scheduleId = b.scheduleId join tre_database.scheduleAgreement  c on c.scheduleId = b.scheduleId 
                                join tre_database.courseSection  d on d.crn = b.crn join tre_database.course  e on e.subject= d.subject and e.courseNum = d.courseNum 
                                    join tre_database.sectionSetting  f on f.crn = d.crn 
                                        join tre_database.advisorAdvisee g on g.studentCwid = a.studentCwid
                                             join tre_database.endUser h 
                                                where c.studentAgree = 1 and c.advisorAgree = 1 and h.cwid = g.advisorCwid;`, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            
            if(res.length == 0) {
                reject(err);
                return;
            }
            resolve(res);
            return;
        })

    })
}


module.exports = {
    validateUser,
    removeClassFromSchedule,
    getAllClassInfo,
    addClassToSchedule,
    getScheduleInfo,
    freeApt,
    getStudentList,
    changeConfirmation,
    getConfirmation,
    getAdv,
    // getAdv1,
    classAgreements
}