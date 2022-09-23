var students = './csvFiles/Students.csv';
var adviser = './csvFiles/Adviser.csv';
var login = './csvFiles/LoginDetails.csv';
var course = './csvFiles/Course.csv'; 
var courseSectionSetting = './csvFiles/Section.csv';
var bannerInfo = './csvFiles/BannerInfo.csv';

const fs = require('fs');
const neatCsv = require('neat-csv');
var dbPopulate = require('./db/dbPopulate.js');

//This is changed per semester 
var term = 'Fall2020';


fs.readFile(students, async (err, data) => {

    try {

      var stdObj = await neatCsv(data);
      for(let i = 0; i < stdObj.length; i++) {
    
        dbPopulate.popEndUser(stdObj[i][`ID number`], stdObj[i][`First name`], '', stdObj[i][`Last name`], stdObj[i][`Email address`]);
        dbPopulate.popAccountCategory(stdObj[i][`ID number`], 'Student');
        dbPopulate.popAdvisorAdvisee(stdObj[i].Adviser, stdObj[i][`ID number`], term);
      }

    } catch (error) {
        console.error(error)
        return
    }
  })



  fs.readFile(adviser, async (err, data) => {

    try {

      var advObj = await neatCsv(data);
      for(let i = 0; i < advObj.length; i++) {
    
        dbPopulate.popEndUser(advObj[i][`ID number`], advObj[i][`First name`], '' , advObj[i][`Last name`], advObj[i][`Email address`]);
        dbPopulate.popAccountCategory(advObj[i][`ID number`], 'Advisor');
      }

    } catch (error) {
        console.error(error)
        return
    }
  })


  fs.readFile(login, async (err, data) => {

    try {
  
        var loginObj = await neatCsv(data);
        for(let i = 0; i < loginObj.length; i++) {
            dbPopulate.popAccountTable(loginObj[i].cwid, loginObj[i].password);
        }
  
    } catch (error) {
        console.error(error)
        return
    }    
  })


fs.readFile(course, async (err, data) => {

    try {
  
        var courseObj = await neatCsv(data);
        
        for(let i = 0; i < courseObj.length; i++) {
            dbPopulate.popCourse(courseObj[i].SubjectCode, courseObj[i].Number, courseObj[i].Title, courseObj[i][`Credit min`], courseObj[i][`Credit Max`]);
        }
  
    } catch (error) {
        console.error(error)
        return
    }    
  })


  

fs.readFile(courseSectionSetting, async (err, data) => {

    try {
  
        var crnObj = await neatCsv(data);
        
        for(let i = 0; i < crnObj.length; i++) {
            dbPopulate.popCourseSection(crnObj[i].CRN, crnObj[i].SubjectCode, crnObj[i].Number);
            dbPopulate.popSectionSetting(crnObj[i].CRN, crnObj[i][`Time Start`], crnObj[i].End, crnObj[i].Day, crnObj[i].Location, crnObj[i].Instructor);
        }
  
    } catch (error) {
        console.error(error)
        return
    }    
  })

  
fs.readFile(bannerInfo, async (err, data) => {

  try {
      var bannerObj = await neatCsv(data);
      
      for(let i = 0; i < bannerObj.length; i++) {
          dbPopulate.popBannerInfo(bannerObj[i].CRN, bannerObj[i].Max, bannerObj[i].Enrolled);
      }

  } catch (error) {
      console.error(error)
      return
  }    
})
