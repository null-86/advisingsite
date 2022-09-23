import { LINK } from './constants';

const addClass = async (studentId, classCrn) => {
    let response = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cwid: studentId, crn: classCrn }) //creating JSON object
    }

    await fetch(LINK + '/api/addClass/', response) // async, wait for server response
    console.log("addClass: " + studentId + " " + classCrn)
    // let r = await results.json();
    //console.log("loginAPI createNew(): " + r)
}