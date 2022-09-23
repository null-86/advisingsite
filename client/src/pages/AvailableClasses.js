import React, { useEffect, useState } from 'react';
import API from '../API';
import { LINK } from '../API/constants';
import { Table, Container } from 'react-bootstrap';
//import { Switch, Route, BrowserRouter, withRouter, Router } from 'react-router-dom';
import { MDBCol, MDBFormInline, MDBBtn, MDBDataTable } from "mdbreact";



const AvailableClasses = () => {
    const [classes, setClasses] = useState([]);
    const [counter, setCounter] = useState(0);

    //let array = [];

    // if (counter === 0) {
    //     let classesList = API.getAllClasses();
    //     setClasses(JSON.stringify(classesList));
    //     console.log(classesList);
    //     setCounter(counter + 1);
    //     //console.log(classesList);
    // }

    useEffect(() => {
        if (counter === 0) {
            fetch(LINK + "/api/getAllClasses/")
                .then((response) => response.json())
                .then((data) => setClasses(data));
            setCounter(counter + 1);
        }
    }, []);

    //setClasses(JSON.stringify(classes);

    function classTable() {
        if (classes) {
            console.log("length of array is " + classes.length);
        }
        // for (var i = 0; i < classes.length; i++) {
        //     console.log(classes.length)
        //     console.log("inside for loop");
        //     document.write("<tr> <th>" + classes[i].crn + "</th>" + "<th>" + classes[i].title + "</th> </tr>")
        // }
    }

    const data = {
        columns: [
            {
                label: 'Course ID',
                field: 'courseID',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Course Title',
                field: 'courseName',
                sort: 'asc',
                width: 350
            },
            {
                label: 'CRN',
                field: 'crn',
                sort: 'asc',
                width: 100
            }
        ],
        rows: classes.map(c => ({ courseID: (c.subj + " " + c.course), courseName: (c.title), crn: c.crn }))
    }


    return (

        <Container>
            <MDBDataTable
                striped
                bordered
                hover
                data={data}
            />

        </Container>
    );
}

export default AvailableClasses;