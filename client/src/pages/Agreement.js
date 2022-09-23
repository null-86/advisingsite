import React, { useEffect, useState } from 'react';
import API from '../API';
import { LINK } from '../API/constants';
import { Table, Container, Button, Card, Alert } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import { blue } from '@material-ui/core/colors';
import '../App.css';
import CookieService from '../API/CookieService';

//import { Switch, Route, BrowserRouter, withRouter, Router } from 'react-router-dom';

const cookieUser = CookieService.get("user-cookie");

const Agreement = () => {
    const [schedule, setSchedule] = useState([]);
    // const [show, setShow] = useState(false);


     useEffect(() => {
            let res = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cwid: cookieUser.id}) 
              }
              
              fetch(LINK + '/api/classAgreements/', res)
              .then((response) => response.json())
              .then((data) => {
                console.log('Taken classes = ',  data);
                setSchedule(data);
                
              });
            
    }, []);
    
    let perSemClasses = new Map();

    schedule.forEach(element => {
        perSemClasses.set(element.term, []);
    });

    for (let semesters of perSemClasses.keys()) {
        schedule.forEach(element => {
            // (element.term === semesters) ? perSemClasses.get(semesters).push(element): '';
            if (element.term === semesters) {
                perSemClasses.get(semesters).push(element);
            } 
        });
    }
    // console.log();
   
    const creditHrs = (min, max) => {
        let credits = '';
        ((min%max)==0) ? credits = min : credits = min + '-' + max;
        return credits;
    }
    // const setT = (tempVal) => {
    //     setTemp(tempVal);
    //     return;
    // }

// <Alert show={show} variant="danger">
//                                         <Alert.Heading>Agreement Details</Alert.Heading>
//                                         <p>
//                                             Is just the class-display enough? any sug
//                                             {/* Advisor Name: {temp} */}
//                                             {/* email: {c.email} */}
//                                         </p>
//                                         <hr />
//                                         <div className="d-flex justify-content-end">
//                                         <Button variant='dark' onClick={() => setShow(false)}>
//                                             Hide details
//                                         </Button>
//                                         </div>
//                                      </Alert>

//                                     {!show && <Button variant='dark' onClick={() => setShow(true)}>Show more details</Button>}



     return (

        <Container style={{width: '80%', }}>

            <Card >
                <Button variant="secondary" size="lg">Advisor/Student Scheduling Agreement</Button>
                <Card.Body>
                    <h3 className="blockquote mb-0">
                        <h5 >
                            Class schedule agreements between {cookieUser.username} and his/her adviser for respective semesters. 
                            It provides a list of subjects agreed upon.
                        </h5>
                        <h6>
                            <p style={{textAlign: 'right', }}>
                                {' '}
                                    University of Louisiana at Monroe(Office of the Registrar) 
                                {' '}
                            </p>
                        </h6>
                    </h3>
                </Card.Body>
             </Card>


            {Array.from(perSemClasses.keys()).map((c) => {
                let totalCredit = 0;
                return (
                    <Accordion defaultActiveKey="0">
                        
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="secondary" size="lg" block eventKey="1">
                                    {c}
                                    
                                </Accordion.Toggle>
                            </Card.Header>

                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Table striped bordered hover variant="dark">
                                        <thead>
                                            <tr>
                                                <th> Course </th>
                                                <th> Name </th>
                                                <th> Instructor </th>
                                                <th> Credit Hours </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontSize: "12pt", fontWeight: "100" }}>
                                            
                                            {perSemClasses.get(c).map((c) => {
                                               {
                                                (c.creditHrsMin == c.creditHrsMax) ? totalCredit += c.creditHrsMin: totalCredit+=c.creditHrsMax;
                                               }
                                                return (
                                                    
                                                    <tr>
                                                        <th>{c.subject + ' ' + c.courseNum}</th>
                                                        <th>{c.title}</th>
                                                        <th>{c.instructor}</th>
                                                        <th>{
                                                            creditHrs(c.creditHrsMin, c.creditHrsMax)
                                                            
                                                        }</th>
                                                    </tr>
                                                    
                                                    
                                                )
                                            })}
                                           <th> Total:</th><th></th><th></th><th>{totalCredit}</th>
                                        </tbody>
                                    </Table>
                                    

                                    {/* alert body here */}
                                </Card.Body>
                                
                             </Accordion.Collapse>
                        </Card> 
                    </Accordion>
                )
            })}
        </Container>
    );
}

export default Agreement;