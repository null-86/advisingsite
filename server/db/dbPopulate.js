var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;


var connection = mysql.createConnection({
    host: 'tre-database2.cyfkpcgifi17.us-east-2.rds.amazonaws.com',
    user: 'rds_user',
    password: '5uP3rSecR3t',
    database: 'tre_database'
});



popEndUser = (cwid, fName, mInit, lName, email) => {
   
    return new Promise((resolve, reject) => {


        connection.query(`Select cwid  FROM tre_database.endUser where cwid = ${cwid}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {

                connection.query(`INSERT INTO tre_database.endUser (cwid, fName, mInit, lName, email) VALUES ('${cwid}', '${fName}', '${mInit}', '${lName}', '${email}');`, 
                     (err) => {
                        if(err){ return reject(err);}
                        console.log(`Successfully filled user: ${cwid}'s info into endUser table`);
                        return resolve;
                     })
            }
            else {
                connection.query(`UPDATE tre_database.endUser SET cwid = '${cwid}', fName = '${fName}', mInit = '${mInit}', lName = '${lName}', email = '${email}' WHERE cwid = '${cwid}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully Updated user: ${cwid}'s info into endUser table`);
                        return resolve;
                })
            }     
        })
    })
}




popAccountCategory = (cwid, acctType) => {
    return new Promise((resolve, reject) => {

        
        connection.query(`Select cwid  FROM tre_database.accountCategory where cwid = ${cwid}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {

                connection.query(`INSERT INTO tre_database.accountCategory (cwid, acctType) VALUES ('${cwid}', '${acctType}');`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully filled user: ${cwid}'s info into accountCategory table`);
                        return resolve;
                    })
            }
            else {
                connection.query(`UPDATE tre_database.accountCategory SET cwid = '${cwid}', acctType = '${acctType}' WHERE cwid = '${cwid}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully Updated user: ${cwid}'s info into accountCategory table`);
                        return resolve;
                 })
            }
        })
            
    })
}


popAdvisorAdvisee = (advisorCwid, studentCwid, term) => {
    return new Promise((resolve, reject) => {

        connection.query(`INSERT IGNORE INTO tre_database.advisorAdvisee (advisorCwid, studentCwid, term) VALUES ('${advisorCwid}', '${studentCwid}', '${term}');`, 
            (err) => {
                if(err){  return reject(err);}
                console.log(`Successfully filled user: ${advisorCwid}'s info into advisorAdvisee table`);
                return resolve;
            })
    })
}



popAccountTable = (cwid, password) => {
    return new Promise((resolve, reject) => {

        connection.query(`Select cwid  FROM tre_database.account where cwid = ${cwid}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {return reject(err)}

                    connection.query(`INSERT INTO tre_database.account(cwid, password) VALUES ('${cwid}', '${hash}');`, 
                        (err) => {
                            if(err){  return reject(err);}
                            console.log(`Successfully filled user: ${cwid}'s info into account table`);
                            return resolve;
                    })
                })  
            }
            else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {return reject(err)}
                    connection.query(`UPDATE tre_database.account SET cwid = '${cwid}', password = '${hash}'  WHERE cwid = '${cwid}';`, 
                            (err) => {
                                if(err){  return reject(err);}
                                console.log(`Successfully Updated user: ${cwid}'s info into account table`);
                                return resolve;
                            })
                })  
            }

        })

    })
}




popCourse = (subject, courseNum, title, creditHrsMin, creditHrsMax) => {
    return new Promise((resolve, reject) => {
        connection.query(`Select subject, courseNum FROM tre_database.course where subject = '${subject}' and courseNum = '${courseNum}'`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {

                connection.query(`INSERT INTO tre_database.course (subject, courseNum, title, creditHrsMin, creditHrsMax) VALUES ('${subject}', '${courseNum}', '${title}', '${creditHrsMin}', '${creditHrsMax}');`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully filled user: ${subject +" "+ courseNum}'s info into course table`);
                        return resolve;
                    })
            }
            else {
                connection.query(`UPDATE tre_database.course SET subject = '${subject}', courseNum = '${courseNum}', title = '${title}', creditHrsMin = '${creditHrsMin}', creditHrsMax = '${creditHrsMax}' where subject = '${subject}' and courseNum = '${courseNum}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully updated user: ${subject +" "+ courseNum}'s info into course table`);
                        return resolve;
                })
            }
        })
    })
}




popCourseSection = (crn, subject, courseNum) => {
    return new Promise((resolve, reject) => {

        connection.query(`Select crn FROM tre_database.courseSection where crn = ${crn}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {
                connection.query(`INSERT INTO tre_database.courseSection (crn, subject, courseNum) VALUES ('${crn}', '${subject}', '${courseNum}');`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully filled crn: ${subject + " " + courseNum + "-" + crn}'s info into courseSection table`);
                        return resolve;
                    })
            }
            else {
                connection.query(`UPDATE tre_database.courseSection SET crn = '${crn}', subject = '${subject}', courseNum = '${courseNum}' WHERE crn = '${crn}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully updated crn: ${subject + " " + courseNum + "-" + crn}'s info into courseSection table`);
                        return resolve;
                })
            }
        })
    })
}

popSectionSetting = (crn, startTime, endTime, weekDays, location, instructor) => {
    return new Promise((resolve, reject) => {
        
        connection.query(`Select crn  FROM tre_database.sectionSetting where crn = ${crn}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {

                connection.query(`INSERT INTO tre_database.sectionSetting (crn, startTime, endTime, weekDays, location, instructor) VALUES ('${crn}', '${startTime}', '${endTime}', '${weekDays}', '${location}', '${instructor}');`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully filled crn: ${crn}'s setting info into sectionSetting table`);
                        return resolve;
                    })
            }
            else {
                connection.query(`UPDATE tre_database.sectionSetting SET crn = '${crn}', startTime = '${startTime}', endTime = '${endTime}', weekDays = '${weekDays}', location = '${location}', instructor = '${instructor}' WHERE crn = '${crn}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully Updated crn: ${crn}'s setting info into sectionSetting table`);
                        return resolve;
                })
            }
        })
    })
}
popBannerInfo = (crn, max, enrolled) => {
    return new Promise((resolve, reject) => {
        
        connection.query(`Select crn  FROM tre_database.BannerInfo where CRN = ${crn}`, (err, value) => {
            if (err) {
                reject(err);
            }
            
            if (value.length == 0) {

                connection.query(`INSERT INTO tre_database.BannerInfo (CRN, Max, Enrolled) VALUES ('${crn}', '${max}', '${enrolled}');`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully filled crn: ${crn}'s banner info into BannerInfo table`);
                        return resolve;
                    })
            }
            else {
                connection.query(`UPDATE tre_database.BannerInfo SET CRN = '${crn}', Max = '${max}', Enrolled = '${enrolled}' WHERE CRN = '${crn}';`, 
                    (err) => {
                        if(err){  return reject(err);}
                        console.log(`Successfully Updated crn: ${crn}'s banner info into BannerInfo table`);
                        return resolve;
                })
            }
        })
    })
}
module.exports = {
    popEndUser,
    popAccountCategory,
    popAdvisorAdvisee,
    popCourse,
    popSectionSetting,
    popCourseSection,
    popAccountTable,
    popBannerInfo
}