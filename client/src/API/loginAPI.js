import { LINK } from './constants';


//function for validating user login
const validate = async (username, password) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password: password }) //creating JSON object
    }

    let results = await fetch(LINK + '/api/authUser/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format

}


const createNew = async (user, pw, em, cwid) => {
    let response = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pw, email: em, id: cwid }) //creating JSON object
    }

    let results = await fetch(LINK + '/api/addUser/', response) // async, wait for server response
    // let r = await results.json();
    //console.log("loginAPI createNew(): " + r)
}

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


//exporting function
export default {
    validate,
    createNew,
    viewAll
}