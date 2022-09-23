import React, { useState } from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; // import shared css
import logout from "../API/SharedFunctions.js"
import API from '../API';
import CookieService from '../API/CookieService';
import StudentSchView from './StudentSchView';
//hi

// let studentList = await API.
var cookieUser;
//console.log("id is " + (cookieUser.id).toString());


//console.log("studentList 0 " + getStudentList());
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
            showStudentSch: false

        }
    };

    // getStudentList() {
    //     let studentList = await API.loginAPI.getStudentList(cookieUser.id);
    //     console.log("funct " + JSON.stringify(studentList))
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
        console.log("funct " + JSON.stringify(stdList));

        if (stdList != undefined)
            this.setState({ studentList: stdList });

        console.log("funct " + JSON.stringify(stdList));
    }

    // componentDidUpdate(prevState){

    //     if(prevState !== this.state.studentList)
    //     {
    //         this.setState(this.state.studentList())
    //     }

    // }
    showSched(cwid) {
        console.log("cwid " + cwid);
        this.setState({ studentCwid: cwid });
        this.setState({ showStudentsch: true })
    }


    render() {
        return (
            <>
                {!this.state.showStudentsch ?
                    <Container>
                        <h1 style={{ textAlign: "center" }}>Welcome {cookieUser.username}!</h1>
                        <Row style={{ padding: "0", margin: "0" }}>

                            <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>


                                <Row className="no-gutters">
                                    <div style={{ backgroundColor: "#480B0B", color: "white", padding: "16px", borderRadius: "25px", textAlign: "center" }}>Need to see what courses a student has left? <br /> <br />Login to Flightpath!<br /><br />
                                        <Button variant="secondary" style={{ color: "white" }} onClick={() => window.open("https://webservices.ulm.edu/flightpath/login", "_blank")}>Flightpath</Button>
                                    </div>
                                </Row>


                            </Col>

                            <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>

                                {/* Available Actions */}


                                <Row className="no-gutters">
                                    <div style={{ backgroundColor: "#480B0B", color: "white", padding: "15px", borderRadius: "25px", textAlign: "center" }}>View, create, modify or approve a student's schedule:<br /><br />
                                        {/* replace the href when we decide what page these will send the user to */}
                                        <DropdownButton variant="secondary" title="Select Student">

                                            {/* dynamically assign buttons and links by passing objects when you creat a Body */}
                                            {this.state.studentList.map((std, i) => {
                                                if (std != null) {
                                                    // return a dropdown item with the link and name provided
                                                    return (<Button variant="light" onClick={() => this.showSched(std.studentCwid)} key={i}><Dropdown.Item onClick={() => this.props.setLocation(std.username + "'s Schedule")} >{std.username}</Dropdown.Item></Button>)
                                                }
                                                return null;
                                            })}

                                            {/* {console.log(studentList)} */}
                                            {/* {console.log("email is " + cookieUser.email)} */}

                                        </DropdownButton>
                                    </div>
                                </Row>

                            </Col>

                            <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>
                                {/* replace the href when we decide what page these will send the user to */}
                                <div style={{ backgroundColor: "#480B0B", color: "white", padding: "15px", borderRadius: "25px", textAlign: "center" }}> View available classes by semester:<br /><br />
                                    <Link to="/availableclasses"> <Button onClick={() => this.props.setLocation("View All Classes")} variant="secondary">View Classes</Button></Link>
                                </div>
                            </Col>



                            <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>

                                <div style={{ backgroundColor: "#480B0B", color: "white", padding: "15px", borderRadius: "25px", textAlign: "center" }}> Please set your free time so students can make advising appointments. <br /><br /> Accept or modify a student's appointment: <br /><br />
                                    <Row className="no-gutters">

                                        <Link to="/advisorappt"><Button onClick={() => this.props.setLocation("Advising Appointments Calendar")} variant="secondary" >Advising Appointments Calendar</Button></Link>
                                    </Row>

                                </div>
                            </Col>
                        </Row>

                    </Container >
                    :
                    <StudentSchView studentCwid={this.state.studentCwid} />
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