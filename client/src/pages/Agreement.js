import React, { useEffect, useState } from 'react';
import { LINK } from '../API/constants';
import { Table, Container, Button, Card, Alert } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import '../App.css';
import CookieService from '../API/CookieService';
import "./css/Agreement.css";
import ReactToExcel from 'react-html-table-to-excel';



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
    console.log(perSemClasses);
   
    const creditHrs = (min, max) => {
        let credits = '';
        ((min%max)==0) ? credits = min : credits = min + '-' + max;
        return credits;
    }
    // const setT = (tempVal) => {
    //     setTemp(tempVal);
    //     return;
    // }

// {/* <Alert show={show} variant="danger">
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

//                                     {!show && <Button variant='dark' onClick={() => setShow(true)}>Show more details</Button>} */}

    // function exportTableToExcel(tableID, filename = ''){
    //     var downloadLink;
    //     var dataType = 'application/vnd.ms-excel';
    //     var tableSelect = document.getElementById(tableID);
    //     var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        
    //     // Specify file name
    //     filename = filename?filename+'.xls':'excel_data.xls';
        
    //     // Create download link element
    //     downloadLink = document.createElement("a");
        
    //     document.body.appendChild(downloadLink);
        
    //     if(navigator.msSaveOrOpenBlob){
    //         var blob = new Blob(['\ufeff', tableHTML], {
    //             type: dataType
    //         });
    //         navigator.msSaveOrOpenBlob( blob, filename);
    //     }else{
    //         // Create a link to the file
    //         downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
    //         // Setting the file name
    //         downloadLink.download = filename;
            
    //         //triggering the function
    //         downloadLink.click();
    //     }
    // }

     return (

        <Container className="mainBackground" style={{width: '100%' }}>
            <br/><br/>
            <Card >
                <Button className="buttons" size="lg" style={{backgroundColor: '#440000'}}>
                    Advisor/Student Scheduling Agreement
                </Button>
                <Card.Body>
                    <h3 className=" mb-0" >
                        <h5 style={{'font-size': '50%'}}>
                            Class schedule agreements between {cookieUser.username} and his/her adviser for respective semesters. 
                            It provides a list of subjects agreed upon.
                        </h5>
                        <h6>
                            <p style={{textAlign: 'right', 'font-size': '40%'}}>
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
                                <Accordion.Toggle as={Button} variant="secondary" size="lg" block eventKey="1" style={{
                                                        backgroundColor: '#440000'
                                                    }}>
                                    {c}
                                    
                                </Accordion.Toggle>
                            </Card.Header>

                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Table responsive striped bordered hover variant="secondary" id={c}>
                                        
                                        <thead>
                                            <tr>
                                                <th> Course </th>
                                                <th> CRN </th>
                                                <th> Name </th>
                                                <th> Instructor </th>
                                                <th> Credit Hours </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontSize: "8pt", fontWeight: "10" }}>
                                            
                                            {perSemClasses.get(c).map((c) => {
                                               {
                                                (c.creditHrsMin == c.creditHrsMax) ? totalCredit += c.creditHrsMin: totalCredit+=c.creditHrsMax;
                                               }
                                                return (
                                                    
                                                    <tr>
                                                        <th>{c.subject + ' ' + c.courseNum}</th>
                                                        <th>{c.crn}</th>
                                                        <th>{c.title}</th>
                                                        <th>{c.instructor}</th>
                                                        <th>{
                                                            creditHrs(c.creditHrsMin, c.creditHrsMax)
                                                            
                                                        }</th>
                                                    </tr>
                                                    
                                                    
                                                )
                                            })}
                                           <th> Total:</th><th></th><th></th><th></th><th>{totalCredit}</th>
                                        </tbody>
                                       
                                    </Table>


                                    <Button className="buttons" size="lg" style={{backgroundColor: '#b3b7bb7a', border: '2px solid rgb(161 9 9)'}}>
                                        <ReactToExcel 
                                            className="btn"
                                            table={c}
                                            filename='Class schedule'
                                            sheet = 'sheet 1'
                                            buttonText = 'Export Schedule to Excel'
                                        />
                                    </Button>
                                    

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