import { SERVER_ROOT } from './constants';



const setAvailableAppointment = async (advisorCwid, yr, mnth, dayNum, startTime, endTime, location) => {

    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({advisorCwid: advisorCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime, location: location}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/setAvailableAppointment/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

// const getStudentAppointments = async (studentCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // creates request JSON obj, only use for post
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({studentCwid: studentCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime}) //creating JSON object
//     }

//     let results = await fetch(SERVER_ROOT + '/api/getStudentAppointments/', request) // async, wait for server response

//     return (results.json()) // turns results into JSON format
// }

// const setAdvisorFreetime = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // creates request JSON obj, only use for post
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({advisorCwid: advisorCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime}) //creating JSON object
//     }

//     let results = await fetch(SERVER_ROOT + '/api/setAdvisorFreetime/', request) // async, wait for server response

//     return (results.json()) // turns results into JSON format
// }

// const getSharedAppointments = async (advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // creates request JSON obj, only use for post
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({advisorCwid: advisorCwid, studentCwid:studentCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime}) //creating JSON object
//     }

//     let results = await fetch(SERVER_ROOT + '/api/getSharedAppointments/', request) // async, wait for server response

//     return (results.json()) // turns results into JSON format
// }

// const getAdvisorFreetime = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // creates request JSON obj, only use for post
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({advisorCwid: advisorCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime}) //creating JSON object
//     }

//     let results = await fetch(SERVER_ROOT + '/api/getAdvisorFreetime/', request) // async, wait for server response

//     return (results.json()) // turns results into JSON format
// }

// const getAdvisorAppointments = async (advisorCwid, yr, mnth, dayNum, startTime, endTime) => {

//     // creates request JSON obj, only use for post
//     let request = {
//         method: "post",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({advisorCwid: advisorCwid, yr:yr, mnth:mnth, dayNum:dayNum, startTime:startTime, endTime:endTime}) //creating JSON object
//     }

//     let results = await fetch(SERVER_ROOT + '/api/getAdvisorAppointments/', request) // async, wait for server response

//     return (results.json()) // turns results into JSON format
// }

const getAdvisorAppointmentsByDateRange = async (advisorCwid, startDateStr, endDateStr) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({advisorCwid: advisorCwid, startDateStr: startDateStr, endDateStr: endDateStr}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/getAdvisorAppointmentsByDateRange/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const assignStudentToAppointment = async (studentCwid, id) => {

    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCwid: studentCwid, id: id }) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/assignStudentToAppointment/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const unassignStudentFromAppointment = async (studentCwid, id) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({studentCwid: studentCwid, id: id}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/unassignStudentFromAppointment/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const deleteTimeSlot = async (id) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/deleteTimeSlot/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const getStudentAvailableAppointmentsByDateRange = async (advisorCwid, studentCwid, startDateStr, endDateStr) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({advisorCwid: advisorCwid, studentCwid: studentCwid, startDateStr: startDateStr, endDateStr: endDateStr}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/getStudentAvailableAppointmentsByDateRange/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const getAdvisor = async (studentCwid) => {
    // creates request JSON obj, only use for post
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({cwid: studentCwid}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + '/api/getAdvisor/', request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

const getName = async (cwid) => {
    // creates request JSON obj, only use for post
    // console.log(cwid)
    let request = {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({cwid: cwid}) //creating JSON object
    }

    let results = await fetch(SERVER_ROOT + "/api/getName/", request) // async, wait for server response

    return (results.json()) // turns results into JSON format
}

export default {
    
    // getAdvisorAppointments,
    // getAdvisorFreetime,
    // getStudentAppointments,
    // getSharedAppointments, 
    // setAdvisorFreetime,
    assignStudentToAppointment,
    unassignStudentFromAppointment,
    setAvailableAppointment,
    getAdvisorAppointmentsByDateRange,
    getStudentAvailableAppointmentsByDateRange,
    deleteTimeSlot,
    getAdvisor,
    getName
}