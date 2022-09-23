import { LINK } from './constants';


//function for validating user login
const validate = async (email, password) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }) //creating JSON object
    }

    let results = await fetch(LINK + '/api/authUser/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

// const getAcctType = async (email) => {
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email }) //creating JSON object
//     }
//     let results = await fetch(LINK + '/api/getAcctType/', request)
//     return (results.json())
// }

const viewAll = async () => {
    // let request = {
    //     method: "post",
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({}) //creating JSON object
    // }

    let results = await fetch(LINK + '/api/viewUsers/') // async, wait for server response
    // let r = await results.json();
    //console.log("loginAPI createNew(): " + r)
    return (results.json());
}

const getUserDetails = async (email) => {
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }) //creating JSON object
    }

    let results = await fetch(LINK + '/api/getUserDetails');

    return (results.json());
}

const getStudentList = async (id) => {
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }) //creating JSON object
    }

    let results = await fetch(LINK + '/api/getStudentList', request);

    return (results.json());
}


//exporting function
export default {
    validate,
    viewAll,
    getUserDetails,
    getStudentList
}