const { time, Console } = require('console');
var mysql = require('mysql');
const { resolve } = require('path');
const { start } = require('repl');


// Establish and store the connection credentials
var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'tre_database'
});

// // get appointment using both advisor and student cwid
// getSharedAppointments = async (advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime) => {
//     return new Promise((resolve, reject) => {

//         if (advisorCwid && studentCwid) {
//             var query = 'Select * from timeSlot join appointment where ' +
//             'timeSlot.id = appointment.id and timeSlot.advisorCwid = ' + advisorCwid;
            
//             // check if studentCwid is null and adjust the sql accordingly 
//             // - allows more functionality without writing a new function
//             if (studentCwid === "null") {
//                 query += ' and (appointment.studentCwid is null or appointment.studentCwid = \'\')';
//             } else {
//                 query += ' and appointment.studentCwid = ' + studentCwid;
//             }

//             query += ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
//             ' and timeSlot.dayNum = ' + dayNum +
//             ' and (' + startTime + ' <= timeSlot.endTime and timeSlot.startTime <= ' 
//             + endTime + ');'

//             connection.query(query, function (err, update)  {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(update);
//             })
//         } else {
//             console.log("one of the parameters was empty");
//         }
//     })
// }

// get all times available for an appointment within a selected date range
getAdvisorAppointmentsByDateRange = async (advisorCwid, startDateStr, endDateStr) => {
    return new Promise((resolve, reject) => {
        if (advisorCwid && startDateStr && endDateStr) {
            // convert data to more easily usable format
            var startDate = new Date(startDateStr);
            var startYr = startDate.getFullYear();
            var startMnth = startDate.getMonth() + 1;
            var startDayNum = startDate.getDate();
            var startHrs = startDate.getHours();
            var startMins = startDate.getMinutes();

            var endDate = new Date(endDateStr);
            var endYr = endDate.getFullYear();
            var endMnth = endDate.getMonth() + 1;
            var endDayNum = endDate.getDate();
            var endHrs = endDate.getHours(); 
            var endMins = endDate.getMinutes();


            var query = 'select appointment.id, advisorCwid, yr, mnth, dayNum, startTime, endTime, studentCwid, location, ' + 
            ' Concat(fName, " ", mInit, " ", lName) as title ' + 
            ' from timeSlot join appointment on timeSlot.id = appointment.id ' + 
            ' left join endUser on endUser.cwid = appointment.studentCwid and timeSlot.advisorCwid = ' + advisorCwid + ' and ' + 
            // database target (start)
            // note: %k expects 0-23 for hrs and %i expects 00-59 for mins. there's no : b/c the database does not store the data as strings
            " STR_TO_DATE(CONCAT(timeSlot.yr, '-', timeSlot.mnth, '-', timeSlot.dayNum, ' ', LPAD(timeSlot.startTime, 4, '0')), '%Y-%c-%e %k%i') between " +
            // begining of search range
            ' STR_TO_DATE(\"' + startYr + '-' + startMnth + '-' +
            startDayNum + ' ' + String(startHrs).padStart(2, '0') + ":" + startMins + "\", \"%Y-%c-%e %k:%i\") and " +
            // end of search range
            ' STR_TO_DATE(\"' + endYr + '-' + endMnth + '-' +
            endDayNum + ' ' + String(endHrs).padStart(2, '0') + ":" + endMins + "\", \"%Y-%c-%e %k:%i\"); ";


            
            // var query = 'select *, Concat(fName, " ", mInit, " ", lName) as title from timeSlot join appointment on timeSlot.id = ' + 
            // ' appointment.id join endUser on endUser.cwid = appointment.studentCwid and timeSlot.advisorCwid = ' + advisorCwid + ' and '  + 
            // // database target (start)
            // // note: %k expects 0-23 for hrs and %i expects 00-59 for mins. there's no : b/c the database does not store the data as strings
            // " STR_TO_DATE(CONCAT(timeSlot.yr, '-', timeSlot.mnth, '-', timeSlot.dayNum, ' ', LPAD(timeSlot.startTime, 4, '0')), '%Y-%c-%e %k%i') between " +
            // // begining of search range
            // ' STR_TO_DATE(\"' + startYr + '-' + startMnth + '-' +
            // startDayNum + ' ' + String(startHrs).padStart(2, '0') + ":" + startMins + "\", \"%Y-%c-%e %k:%i\") and " +
            // // end of search range
            // ' STR_TO_DATE(\"' + endYr + '-' + endMnth + '-' +
            // endDayNum + ' ' + String(endHrs).padStart(2, '0') + ":" + endMins + "\", \"%Y-%c-%e %k:%i\"); ";
 
            
            connection.query(query, function (err, update) {
                if(err) {
                    reject(err);
                    return;
                }

                if(update.length==0) {
                    resolve("no result");
                    return;
                }

                resolve(update);
            });
        }
        else {
            console.log("one of the parameters was empty");
            resolve("one of the parameters was empty");
        }
    })
}

// get all times available for an appointment within a selected date range
getStudentAvailableAppointmentsByDateRange = async (advisorCwid, studentCwid, startDateStr, endDateStr) => {
    return new Promise((resolve, reject) => {
        if (advisorCwid && studentCwid && startDateStr && endDateStr) {
            // convert data to more easily usable format
            var startDate = new Date(startDateStr);
            var startYr = startDate.getFullYear();
            var startMnth = startDate.getMonth();
            var startDayNum = startDate.getDate();
            var startHrs = startDate.getHours();
            var startMins = startDate.getMinutes();

            var endDate = new Date(endDateStr);
            var endYr = endDate.getFullYear();
            var endMnth = endDate.getMonth();
            var endDayNum = endDate.getDate();
            var endHrs = endDate.getHours(); 
            var endMins = endDate.getMinutes();

            // before implementing titles
            // var query = 'select * from timeSlot join appointment where timeSlot.id = ' + 
            // ' appointment.id and timeSlot.advisorCwid = ' + advisorCwid + ' and (appointment.studentCwid is null or appointment.studentCwid = ' + studentCwid + ') and ' + 
            
            
            var query = 'select appointment.id, advisorCwid, yr, mnth, dayNum, startTime, endTime, studentCwid, location, ' + 
            ' Concat(fName, " ", mInit, " ", lName) as title ' + 
            ' from timeSlot join appointment on timeSlot.id = appointment.id ' + 
            ' left join endUser on endUser.cwid = appointment.studentCwid and timeSlot.advisorCwid = ' + advisorCwid + ' and (appointment.studentCwid is null or appointment.studentCwid = ' + studentCwid + ') and ' + 
            // database target (start)
            // note: %k expects 0-23 for hrs and %i expects 00-59 for mins. there's no : b/c the database does not store the data as strings
            " STR_TO_DATE(CONCAT(timeSlot.yr, '-', timeSlot.mnth, '-', timeSlot.dayNum, ' ', LPAD(timeSlot.startTime, 2, '0')), '%Y-%c-%e %k%i') between " +
            // begining of search range
            ' STR_TO_DATE(\"' + startYr + '-' + startMnth + '-' +
            startDayNum + ' ' + String(startHrs).padStart(2, '0') + ":" + startMins + "\", \"%Y-%c-%e %k:%i\") and " +
            // end of search range
            ' STR_TO_DATE(\"' + endYr + '-' + endMnth + '-' +
            endDayNum + ' ' + String(endHrs).padStart(2, '0') + ":" + endMins + "\", \"%Y-%c-%e %k:%i\"); ";
 

            connection.query(query, function (err, update) {
                if(err) {
                    reject(err);
                    return;
                }

                if(update.length==0) {
                    resolve("no result");
                    return;
                }

                if(update.length == 0) {
                    reject(err);
                    return;
                }

                resolve(update);
            });
        }
        else {
            console.log("one of the parameters was empty");
            resolve(er);
        }
    })
}

// get all advisor appointments that overlap designated time
getAdvisorAppointments = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {
    return new Promise((resolve, reject) => {

        if (advisorCwid && yr && mnth && dayNum && startTime && endTime) {
            var query = 'Select * from timeSlot join appointment where ' +
            'timeSlot.id = appointment.id and timeSlot.advisorCwid = ' + advisorCwid +
            ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
            ' and timeSlot.dayNum = ' + dayNum +
            ' and (' + startTime + ' <= timeSlot.endTime and timeSlot.startTime <= ' 
            + endTime + ');';
            connection.query(query, function (err, update)  {
                if (err) {
                    reject(err);
                }
                resolve(update);
            })
        } else {
            console.log("one of the parameters was empty")
            resolve(update);
        }
    })
}


// get advisor's list of freetimes
getAdvisorFreetime = async (advisorCwid, yr, mnth, dayNum, startTime, endTime)  => {
    return new Promise((resolve, reject) => {
        
        if (advisorCwid && yr && mnth && dayNum && startTime && endTime) {
            // gets advisor freetime that touches or overlaps designated time
            connection.query('Select * from timeSlot where ' +
            ' timeSlot.advisorCwid = ' + advisorCwid +
            ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
            ' and timeSlot.dayNum = ' + dayNum +
            ' and (' + startTime + ' <= timeSlot.endTime and timeSlot.startTime <= ' 
            + endTime + ')', function (err, update)  {
                if (err) {
                    reject(err);
                }
                resolve(update);
            })
        } else {
            console.log("one of the parameters was empty")
            resolve(update);
        }

        
    })
}


// // get all student appointments that overlap designated time
// getStudentAppointments = async (studentCwid, yr, mnth, dayNum, startTime, endTime) => {
//     return new Promise((resolve, reject) => {
//         // studentCwid is allowed to be null
//         if (studentCwid !== undefined && yr && mnth && dayNum && startTime && endTime) {
//             // gets student appointments that touch or overlap designated time
//             var query ='Select * from timeSlot join appointment where ' +
//             ' timeSlot.id = appointment.id and ' + 
//             ' appointment.studentCwid = ' + studentCwid +
//             ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
//             ' and timeSlot.dayNum = ' + dayNum +
//             ' and (' + startTime + ' <= timeSlot.endTime and timeSlot.startTime <= ' 
//             + endTime + ')';
//             //console.log(query);
//             connection.query(query, function (err, update)  {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(update);
//             })
//         } else {
//             console.log("one of the parameters was empty");
//         }
//     })
// }

// // assigning student to an appt. if the student is selecting from freetime, create appt
// assignStudentToTimeSlot = async (studentCwid, id, advisorCwid, yr, mnth, dayNum, startTime, endTime) => {
//     return new Promise((resolve, reject) => {

//         if (studentCwid && id) {
            
//             // check if appointment exists in appointment table
//             var count = 0;
//             var query = 'select count(*) as count from appointment where appointment.id = ' + id;
//             connection.query(query, function (err, update) {
//                 if (err) {
//                     reject(err);
//                 }

//                 // check if more than 1 entry exists
//                 Object.keys(update).forEach(function(key) {
//                     if(update[key]['count'] > 0) {
//                         count = 1;
//                         return;
//                     }
//                 }); 

//                 // record exists in appointment table
//                 if(count > 0){
//                     assignStudentToAppointment(studentCwid, id);
//                 } 
               
//                 // record does not exist in appt
//                 else {
//                     // check for record in timeSlot
//                     // note: because we have id, there should be a timeslot connected to it. I'm going 
//                     // to error check here anyway as good practice
//                     var count2 = 0;
//                     var query2 = 'select count(*) as count from timeSlot where timeSlot.id = ' + id;
//                     connection.query(query2, function (err, update) {
//                         if (err) {
//                             reject(err);
//                         }

//                         // check if more than 1 entry exists
//                         Object.keys(update).forEach(function(key) {
//                             if(update[key]['count'] > 0) {
//                                 count2 = 1;
//                                 return;
//                             }
//                         }); 
                        
//                         // if entry exists in timeslot
//                         if (count2 > 0) {
//                             // assign student to that timeslot
//                             assignStudentToFreeTime(studentCwid, id, advisorCwid, yr, mnth, dayNum, startTime, endTime);
//                         }
//                         else {
//                             resolve("failed to assign student");
//                         }
//                     });
//                 }
//             })

//         } else {
//             console.log("one of the parameters was empty");
//         }
//     })
// }

// set Available appointment (advisor does this)
// setAvailableAppointment = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {
//     console.log(advisorCwid, yr, mnth, dayNum, startTime, endTime);
//     return new Promise((resolve, reject) => {
 
//         if (advisorCwid && yr && mnth && dayNum && startTime && endTime) {
            
//             // check for overlapping appts 
//             var duplicate = 0;
//             var query = 'select count(*) as count from timeSlot join appointment where ' + 
//             ' timeSlot.id = appointment.id and ' + 
//             ' timeSlot.advisorCwid = ' + advisorCwid +
//             ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
//             ' and timeSlot.dayNum = ' + dayNum +
//             ' and (' + endTime + ' >= timeSlot.endTime and timeSlot.startTime >= ' 
//             + startTime + ');';
            
//             connection.query(query, async function (err, update) {
//                 if (err) {
//                     console.log("cannot set overlapping appt"); 
//                 }
                    
//                 // check if more than 1 entry exists
//                 Object.keys(update).forEach(function(key) {
//                     if(update[key]['count'] > 0) {
                        
//                         duplicate = 1;
//                         return;
//                     }
//                 });
                
//                 // if no dupe
//                 if (duplicate <= 0) {

//                     // insert entry into timeSlot
//                     var query = 'Insert into timeSlot ' +
//                     ' (advisorCwid, yr, mnth, dayNum, startTime, endTime) ' +
//                     ' Values (' + advisorCwid + ', ' + yr + ', ' +  mnth + ', ' +  dayNum
//                     + ', ' +  startTime + ', ' +  endTime + ');';
//                     connection.query(query, function (err, update)  {
//                         if (err) {
//                             // log error to console; don't crash program, since this has a 
//                             // reasonable chance of failure
//                             //reject(err);
//                             console.log("failed to insert time: either undef vars or advisor does not exist in db");
//                         }
                        
//                         var num = 0;
//                         // retrieve last insert id
//                         connection.query("select LAST_INSERT_ID() as num", function (err, update) {
                            
//                             // check if more than 1 entry exists
//                             Object.keys(update).forEach(function(key) {
//                                 if(update[key]['num'] > 0) {
//                                     num = update[key]['num'];
//                                     return;
//                                 }
//                             });
                            
//                             console.log(num);
//                             // now insert record into appointment
//                             connection.query('Insert into appointment(id, location) ' +
//                             ' Values (' + num + ', ' + "\"ApptDB setAvlApt\"" + ');', function (err, update)  {
//                                 if (err) {
//                                     // log error
//                                     reject(err);
//                                     console.log("failed to create appt");
//                                 }
//                                 //console.log('appt made');
//                                 //resolve(update);
//                             })

//                             // split any overlapping freeTimes
//                             splitFreetimes(advisorCwid, yr, mnth, dayNum, startTime, endTime);
                            
//                             resolve(update)
//                         });  
//                     });
//                 } else {
//                     console.log("duplicate entry detected in setAppt");
//                 }
//                 //resolve(update);
                
//             });

//         }
//     });
// }

// should help with multi-users
// var inUse = false;
// set Available appointment (advisor does this)
setAvailableAppointment = async (advisorCwid, yr, mnth, dayNum, startTime, endTime, location) => {

// console.log(a]]]]dvisorCwid, yr,  mnth , dayNum , startTime, endTime, location, Date.now());
    // while (!inUse) {
        return new Promise((resolve, reject) => {
            
            if (advisorCwid && yr && mnth && dayNum && (startTime || startTime.toString() == "0") && (endTime || endTime.toString() == "0")) {

                // check for overlapping appts 
                var duplicate = 0;
                var query = 'select count(*) as count from timeSlot join appointment where ' + 
                ' timeSlot.id = appointment.id and ' + 
                ' timeSlot.advisorCwid = ' + advisorCwid +
                ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
                ' and timeSlot.dayNum = ' + dayNum +
                ' and (' + endTime + ' >= timeSlot.endTime and timeSlot.startTime >= ' 
                + startTime + ');';
                
                connection.query(query, function (err, update) {
                    if (err) {
                        console.log("cannot set overlapping appt"); 
                    }
                    
                    // check if more than 1 entry exists
                    Object.keys(update).forEach(function(key) {
                        if(update[key]['count'] > 0) {
                            duplicate = 1;
                            return;
                        }
                    });
                    
                    // if no dupe
                    if (duplicate <= 0) {
    
                        // insert entry into timeSlot
                        var query = 'Insert into timeSlot ' +
                        ' (advisorCwid, yr, mnth, dayNum, startTime, endTime) ' +
                        ' Values (' + advisorCwid + ', ' + yr + ', ' +  mnth + ', ' +  dayNum
                        + ', ' +  startTime + ', ' +  endTime + ');';
                        connection.query(query, function (err, update)  {
                            if (err) {
                                // log error to console; don't crash program, since this has a 
                                // reasonable chance of failure
                                //reject(err);
                                console.log("failed to insert time: either undef vars or advisor does not exist in db");
                            }
                            
                            var num = 0;
                            // retrieve last insert id
                            var query3 = "select id as num from timeSlot where " + 
                            ' timeSlot.advisorCwid = ' + advisorCwid +
                            ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
                            ' and timeSlot.dayNum = ' + dayNum +
                            ' and timeSlot.startTime = ' + startTime +
                            ' and timeSlot.endTime = ' + endTime + ';';
                            connection.query(query3, function (err, update) {
                                if (err) {
                                    // log error
                                    console.log("issue with query3 of AppointmentDB");

                                    //reject(err);
                                }

                                // check if more than 1 entry exists
                                Object.keys(update).forEach(function(key) {
                                    if(update[key]['num'] > 0) {
                                        num = update[key]['num'];
                                        return;
                                    }
                                });
                                
                                // default location
                                if (location == null) {
                                    location = "Advisor's Office";
                                }

                                // now insert record into appointment
                                connection.query('Insert into appointment(id, location) ' +
                                ' Values (' + num + ', ' + "\"" + (location) + "\"" + ');', function (err, update)  {
                                    if (err) {
                                        // log error
                                        reject(err);
                                        console.log(err);
                                        console.log("failed to create appt");
                                        // remove timeSlot entry
                                        deleteTimeSlot(num);
                                    }
                                    // console.log('appt made');
                                    //resolve(update);
                                });
    
                                // split any overlapping freeTimes
                                //splitFreetimes(advisorCwid, yr, mnth, dayNum, startTime, endTime);
                                
                                // inUse = false;
                                resolve(update)
                            });
                            // connection.query("select LAST_INSERT_ID() as num", function (err, update) {
                                
                            //     // check if more than 1 entry exists
                            //     Object.keys(update).forEach(function(key) {
                            //         if(update[key]['num'] > 0) {
                            //             num = update[key]['num'];
                            //             return;
                            //         }
                            //     });
                                
                            //     console.log(num);
                            //     // now insert record into appointment
                            //     connection.query('Insert into appointment(id, location) ' +
                            //     ' Values (' + num + ', ' + "\"ApptDB setAvlApt\"" + ');', function (err, update)  {
                            //         if (err) {
                            //             // log error
                            //             reject(err);
                            //             console.log("failed to create appt");
                            //         }
                            //         //console.log('appt made');
                            //         //resolve(update);
                            //     })
    
                            //     // split any overlapping freeTimes
                            //     splitFreetimes(advisorCwid, yr, mnth, dayNum, startTime, endTime);
                                
                            //     inUse = false;
                            //     resolve(update)
                            // });  
                        });
                    } else {
                        // must resolve or else the server code hangs
                        //console.log("duplicate entry detected in setAppt");
                        resolve(update);
                    }
                    //resolve(update);
                    
                });
    
            }
            resolve("idk how i got here")
        });
       
}

// set an advisor's available freetimes
setAdvisorFreetime = async (advisorCwid, yr, mnth, dayNum, startTime, endTime)  => {
    return new Promise((resolve, reject) => {

        // add entry to timeSlot
        if (advisorCwid && yr && mnth && dayNum && startTime && endTime) {

            // check for duplicates
            var duplicate = 0;
            connection.query('select count(*) from timeSlot where ' + 
            ' timeSlot.advisorCwid = ' + advisorCwid +
            ' and timeSlot.yr = ' + yr + ' and timeSlot.mnth = ' + mnth + 
            ' and timeSlot.dayNum = ' + dayNum +
            ' and (' + startTime + ' = timeSlot.startTime or ' + endTime + 
            ' = timeSlot.endTime)', function (err, update)  {
                if (err) {
                    console.log("cannot set overlapping time slot");
                    
                }

                // check if more than 1 entry exists
                Object.keys(update).forEach(function(key) {
                    if(update[key]['count'] > 0) {
                        duplicate = 1;
                        return;
                    }
                });

                // if no duplicates, add entry
                if (duplicate <= 0) {
                    connection.query('INSERT INTO timeSlot(advisorCwid, yr, mnth, dayNum, startTime, endTime) ' +
                    ' Values (' + advisorCwid + ', ' + yr + ', ' +  mnth + ', ' +  dayNum
                    + ', ' +  startTime + ', ' +  endTime + ');',
                    function (err, update)  {
                        if (err) {
                            reject(err);
                        }
                        resolve(update);
                    });
                }
            });
        } else {
            console.log("one of the parameters was empty");
            resolve(update);
        }

    });
}


// delete a freetime or appointment by id
deleteTimeSlot = async (id) => {
    return new Promise((resolve, reject) => {

        if (id) {
            // delete from appointment (must come before timeSlot delete)
            connection.query('DELETE FROM appointment where appointment.id = ' + id,
            function (err, update)  {
                if (err) {
                    reject(err);
                }
                //console.log("deleted from appointment");
                resolve(update);
            });

            // delete from timeSlot
            connection.query('DELETE FROM timeSlot where timeSlot.id = ' + id,
            function (err, update)  {
                if (err) {
                    reject(err);
                }
                //console.log("deleted from timeSlot");
                resolve(update);
            });
        } else {
            console.log("one of the parameters was empty");
            resolve(update);
        }
    });
}
// private helper methods below: probably don't need to export
// split freetimes around an appointment
// the params refer to the prospective appt's details
splitFreetimes = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {
    
    // get overlapping freeTimes
    var freetimes = await getAdvisorFreetime(advisorCwid, yr, mnth, dayNum, startTime, endTime);

    // split freeTimes around appt
    freetimes.forEach(freeTime => {

        // note that < time means earlier
        var changes = 0;

        // freetime starts before appt
        if (freeTime.startTime < startTime) {
            // make freetime before appt
            var before = JSON.parse(JSON.stringify(freeTime));
            before.endTime = startTime;
            // dont make an appt that starts and ends at same time
            if (before.endTime != before.startTime) {
                setAdvisorFreetime(before.advisorCwid, before.yr, 
                    before.mnth, before.dayNum, before.startTime, before.endTime);
                changes++;
            }
        }

        // freetime endTimes after appt
        if (endTime < freeTime.endTime) {
            // make freetime after appt
            var after = JSON.parse(JSON.stringify(freeTime));
            after.startTime = endTime;
            // dont make an appt that starts and ends at same time
            if (after.endTime != after.startTime) {
                setAdvisorFreetime(after.advisorCwid, after.yr, 
                    after.mnth, after.dayNum, after.startTime, after.endTime);
                changes++; 
            }
        }   

        // only delete records if new entries were created to replace it
        // changes tracks how many new records/changes there are
        if (changes > 0) {
            // delete old freetime entry from db
            deleteTimeSlot(freeTime.id);
        }
    });
}

// don't export this. api should use assignStudentToTimeSlot
// changed mind; am exporting this
assignStudentToAppointment = async (studentCwid, id) => {
    return new Promise((resolve, reject) => {

        if (studentCwid && id) {
            var query = 'UPDATE appointment Set appointment.studentCwid = ' +
            studentCwid + ' WHERE appointment.id = ' + id + ';'
            connection.query(query, function (err, update)  {
                if (err) {
                    reject(err);
                }

                resolve(update);
            });
        } else {
            // this must throw error or assignStudentToTimeSlot will not catch error 
            console.log("one of the parameters was empty");
            resolve(update);
        }
    });
}

unassignStudentFromAppointment = async (studentCwid, id) => {
    return new Promise((resolve, reject) => {

        if (studentCwid && id) {
            var query = 'UPDATE appointment Set appointment.studentCwid = null WHERE appointment.id = ' + id + 
            ' and appointment.studentCwid = ' + studentCwid + ';'
            connection.query(query, function (err, update)  {
                if (err) {
                    reject(err);
                }

                resolve(update);
            });
        } else {
            // this must throw error or assignStudentToTimeSlot will not catch error 
            console.log("one of the parameters was empty");
            resolve(update);
        }
    });
}


// // don't export this. api should use assignStudentToTimeSlot
// assignStudentToFreeTime = async (studentCwid, id, advisorCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // make appointment 
//     setAvailableAppointment(advisorCwid, yr, mnth, dayNum, startTime, endTime).then( function() {
//         // retrieve id
//         connection.query("select LAST_INSERT_ID() as num", function (err, update) {
//             if (err){
//                 console.log(err);
//             }      
//             var num = 0;
//             // check if more than 1 entry exists
//             Object.keys(update).forEach(function(key) {
//                 if(update[key]['num'] > 0) {
//                     num = update[key]['num'];
//                     return;
//                 }
//             });
            

//             // assign appointment
//             assignStudentToAppointment(studentCwid, num);
//         });
//     });
    
    
    
// }

// might be okay to export, but don't do it unless you absolutely need to
getTimeSlotByID = async (id) => {
    return new Promise((resolve, reject) => {

        if (id) {
            connection.query('SELECT * from timeSlot WHERE timeSlot.id = ' + id, function (err, update)  {
                if (err) {
                    reject(err);
                }
                resolve(update);
            })
        } else {
            console.log("one of the parameters was empty");
            resolve(update);
        }
    });
}

getName = async (cwid) => {
    return new Promise((resolve, reject) => {

        if (cwid) {
            connection.query('SELECT Concat(fName, " ", mInit, " ", lName) as name from endUser WHERE endUser.cwid = ' + cwid, function (err, update)  {
                if (err) {
                    reject(err);
                }
                // console.log(update);
                resolve(update);
            })
        } else {
            // console.log("one of the parameters was empty");
            res = [{name: "Open"}]
            resolve(res);
        }
    });
}

//https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly/32648526
mysql_real_escape_string = (str) => {
    str = str.toString();

    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}


// exports.assignStudentToTimeSlot = this.assignStudentToTimeSlot;
// exports.getAdvisorAppointments = this.getAdvisorAppointments;
// exports.getAdvisorFreetime = this.getAdvisorFreetime;
// exports.getSharedAppointments = this.getSharedAppointments;
// exports.getStudentAppointments = this.getStudentAppointments;
// exports.setAdvisorFreetime = this.setAdvisorFreetime;
exports.setAvailableAppointment = this.setAvailableAppointment;
exports.getAdvisorAppointmentsByDateRange = this.getAdvisorAppointmentsByDateRange;
exports.getStudentAvailableAppointmentsByDateRange = this.getStudentAvailableAppointmentsByDateRange;
exports.deleteTimeSlot = this.deleteTimeSlot;
exports.assignStudentToAppointment = this.assignStudentToAppointment;
exports.unassignStudentFromAppointment = this.unassignStudentFromAppointment;
exports.getName = this.getName;