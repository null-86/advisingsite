import React from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
// import history from './history';
import '../App.css'; // import shared css
import logout from "../API/SharedFunctions.js"
import API from '../API';
import CookieService from '../API/CookieService';

/* these values are passed into the Body class to populate the semester list,
TODO: it should be possible to add values to this programatically, but I haven't worked on that yet
because we dont know how we will retrieve the data */
// const routeChange = () => {
//     let path = `/viewschedule`;
//     let history = useHistory();
//     history.push(path);
// }

var cookieUser;

const handleViewSch = () => {
    console.log("click");
    window.location.href = ("/viewschedule");
    //this.props.history.push('/viewschedule');
}
// function routeChange(path) {
//     window.location.href = ("/" + path + "");
//     //     let path = `/viewschedule`;
//     //     let history = useHistory();
//     //     history.push(path);
// }
class Body extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // let studentList = await API.
        cookieUser = CookieService.get("user-cookie");
        this.props.setLocation("Home");
    };

    // componentDidMount() {
    //     this.props.setLocation("Home");
    // }


    render() {
        return (
            <Container >
                {console.log(this.props)}
                <h1 style={{ textAlign: "center" }}>Welcome {cookieUser.username}!</h1>
                <Row style={{ padding: "0", margin: "0" }}>

                    <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>


                        <Row className="no-gutters">
                            <div style={{ backgroundColor: "#480B0B", color: "white", padding: "16px", borderRadius: "25px", textAlign: "center" }}>Need to see what courses you have left? <br /> <br />Login to Flightpath!<br /><br />
                                <Button variant="secondary" style={{ color: "white" }} onClick={() => window.open("https://webservices.ulm.edu/flightpath/login", "_blank")}>Flightpath</Button>
                            </div>
                        </Row>

                    </Col>

                    <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>

                        <Row className="no-gutters">
                            <div style={{ backgroundColor: "#480B0B", color: "white", padding: "16px", borderRadius: "25px", textAlign: "center" }}>Check your current class schedule: <br /> <br />
                                <Link to="/viewschedule"><Button onClick={() => this.props.setLocation("Class Schedule")} variant="secondary" >Class Schedule</Button></Link>
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
                        {/* replace the href when we decide what page these will send the user to */}
                        <div style={{ backgroundColor: "#480B0B", color: "white", padding: "15px", borderRadius: "25px", textAlign: "center" }}> View all the schedule agreements:<br /><br />
                            <Link to="/agreement"> <Button onClick={() => this.props.setLocation("View all Agreements")} variant="secondary">View Agreements</Button></Link>
                        </div>
                    </Col>


                    <Col style={{ padding: "5%", margin: "0", color: "black", textDecoration: "underline" }}>

                        <div style={{ backgroundColor: "#480B0B", color: "white", padding: "15px", borderRadius: "25px", textAlign: "center" }}> Please choose a time so you and your advisor can make an appointment. <br /><br /> Accept or modify your advising appointment: <br /><br />
                            <Row className="no-gutters">

                                <Link to="/studentappt"><Button onClick={() => this.props.setLocation("Advising Appointments Calendar")} variant="secondary" >Advising Appointments Calendar</Button></Link>
                            </Row>

                        </div>
                    </Col>
                </Row>
            </Container >
        );
    }
}

const StudentHome = (setLocation) => {

    return (

        /* set padding=0 to remove whitespace at edge */
        <Container fluid className="no-gutters" style={{ padding: "0", margin: "0" }}>

            {console.log(setLocation)}
            {/** instantiate header and pass name of current page*/}
            {/* <Header currentPage="Home" /> */}

            {/** instantiate body and pass array of semesters (each has a name and a link for the page) */}
            <Body setLocation={setLocation.setLocation}></Body>


        </Container>
    )
}

export default StudentHome;

