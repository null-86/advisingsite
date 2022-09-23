import React, { useState } from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; // import shared css
import logout from "../API/SharedFunctions.js"
import API from '../API';
import CookieService from '../API/CookieService';
import StudentSchView from './StudentSchView';
import Agreement from './AgreementAdvView';
import './Home.css';
//hi

// let studentList = await API.
var cookieUser;
////// console.log("id is " + (cookieUser.id).toString());


////// console.log("studentList 0 " + getStudentList());
/* these values are passed into the Body class to populate the semester list,
TODO: it should be possible to add values to this programatically, but I haven't worked on that yet
because we dont know how we will retrieve the data */
const students = [

];


// // the header of the page
// class Header extends React.Component {
//     render() {
//         return ( <Navbar bg="light" expand="lg">
//         <Navbar.Brand href="#home">Home</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ml-auto" >
//             <Nav.Link href="#home">Home</Nav.Link>
//             <Nav.Link href="#link">Faculty Profile</Nav.Link>
//             <Button variant="primary" onClick={() => logout()}>Logout</Button>
//           </Nav>
//         </Navbar.Collapse>
//       </Navbar>

//         );
//     }
// }

class Body extends React.Component {
    constructor(props) {
        super(props); // getting props sent from other classes

        this.componentDidMount = this.componentDidMount.bind(this);

        this.state = { // current state of the Component
            studentList: [],
            studentCwid: undefined,
            showStudentSch: false,
            agreements:false

        }
    };

    // getStudentList() {
    //     let studentList = await API.loginAPI.getStudentList(cookieUser.id);
    //     //// console.log("funct " + JSON.stringify(studentList))
    //     return JSON.stringify(studentList);
    // }


    componentWillMount() {
        // let studentList = await API.
        cookieUser = CookieService.get("user-cookie");
        this.props.setLocation("Home");
    }

    async componentDidMount() {
        // let temp = getStudentList();
        // this.setState.studentList(temp);
        let stdList;

        stdList = await API.loginAPI.getStudentList(cookieUser.id);
        //// console.log("funct " + JSON.stringify(stdList));

        if (stdList != undefined)
            this.setState({ studentList: stdList });

        //// console.log("funct " + JSON.stringify(stdList));
    }

    // componentDidUpdate(prevState){

    //     if(prevState !== this.state.studentList)
    //     {
    //         this.setState(this.state.studentList())
    //     }

    // }
    showSched(cwid) {
        //// console.log("cwid " + cwid);
        this.setState({ studentCwid: cwid });
        this.setState({ showStudentsch: true })
    }

    showAgreement(cwid) {
        //// console.log("cwid " + cwid);
        this.setState({ studentCwid: cwid });
        this.setState({ agreements: true })
    }

    render() {
        return (
            <>
                {(!this.state.showStudentsch && !this.state.agreements) ?
                    <Container>
                        <Row className="HomeHeader">
                            <Col>
                                University of Louisiana Monroe Advising
                            </Col>
                        </Row>

                        <Row className="LinkRow">
                            <Col>
                                Advising Agreements By Student <br/>
                                <DropdownButton variant="light" title="Select Student">
                                    {this.state.studentList.map((std, i) => {
                                                if (std != null) {
                                                    // return a dropdown item with the link and name provided
                                                    return (<Button style={{width:"100%"}} variant="light" onClick={() => this.showAgreement(std.studentCwid)} key={i}><Dropdown.Item onClick={() => this.props.setLocation(std.username + "'s Agreement")} >{std.username}</Dropdown.Item></Button>)
                                                }
                                                return null;
                                            })}
                                </DropdownButton>
                            </Col>
                        </Row>

                        <Row className="LinkRow">
                            <Col>
                                Schedule By Student <br/>
                                <DropdownButton variant="light" title="Select Student">

                                            {/* dynamically assign buttons and links by passing objects when you creat a Body */}
                                            {this.state.studentList.map((std, i) => {
                                                if (std != null) {
                                                    // return a dropdown item with the link and name provided
                                                    return (<Button style={{width:"100%"}} variant="light" onClick={() => this.showSched(std.studentCwid)} key={i}><Dropdown.Item onClick={() => this.props.setLocation(std.username + "'s Schedule")} >{std.username}</Dropdown.Item></Button>)
                                                }
                                                return null;
                                            })}

                                            {/* {//// console.log(studentList)} */}
                                            {/* {//// console.log("email is " + cookieUser.email)} */}

                                        </DropdownButton>
                            </Col>
                        </Row>

                        <Row className="LinkRow">
                            <Col>
                                Your Advising Calendar <br/>
                                <Link to="/advisorappt"><Button onClick={() => this.props.setLocation("Advising Appointments Calendar")} variant="light" >View</Button></Link>
                            </Col>
                        </Row>

                        <Row className="LinkRow">
                            <Col>
                                Browse Available Courses <br/>
                                <Link to="/availableclasses"> <Button onClick={() => this.props.setLocation("View All Classes")} variant="light">View</Button></Link>
                            </Col>
                        </Row>

                        <Row className="LinkRow">
                            <Col>
                                ULM Flightpath Service <br/>
                                <Button variant="light" onClick={() => window.open("https://webservices.ulm.edu/flightpath/login", "_blank")}>View</Button>
                            </Col>
                        </Row>
                    </Container>
                    :
                    (this.state.showStudentsch) ?
                        <StudentSchView studentCwid={this.state.studentCwid} /> :
                        (this.state.agreements) ? <Agreement studentCwid={this.state.studentCwid}/> :
                        ''
                            

                }
            </>
        );
    }
}

const AdvisorHome = (setLocation) => {
    return (
        /* set padding=0 to remove whitespace at edge */
        <Container fluid className="no-gutters" style={{ padding: "0", margin: "0" }}>


            {/** instantiate header and pass name of current page*/}
            {/* <Header currentPage="Home" /> */}

            {/** instantiate body and pass array of semesters (each has a name and a link for the page) */}
            <Body setLocation={setLocation.setLocation}></Body>


        </Container>
    )
}

export default AdvisorHome;