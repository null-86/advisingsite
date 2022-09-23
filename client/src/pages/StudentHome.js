import React from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row, CardColumns, Card, CardDeck} from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
// import history from './history';
import '../App.css'; // import shared css
import logout from "../API/SharedFunctions.js"
import API from '../API';
import CookieService from '../API/CookieService';
import './Home.css'
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
            <>
                <Container>

                    <Row className="HomeHeader">
                        <Col>
                            University of Louisiana Monroe Advising
                            
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
                            Your Advising Agreements <br/>
                            <Link to="/agreement"> <Button onClick={() => this.props.setLocation("View Agreements")} variant="light">View</Button></Link>
                        </Col>
                    </Row>

                    <Row className="LinkRow">
                        <Col>
                            Your Current Class Schedule <br/>
                            <Link to="/viewschedule"><Button onClick={() => this.props.setLocation("Class Schedule")} variant="light">View</Button></Link>
                        </Col>
                    </Row>

                    <Row className="LinkRow">
                        <Col>
                            Your Advising Calendar <br/>
                            <Link to="/studentappt"><Button onClick={() => this.props.setLocation("Advising Appointments Calendar")} variant="light" >View</Button></Link>                        
                        </Col>
                    </Row>

                    <Row className="LinkRow">
                    <Col>
                            ULM Flightpath Service <br/>
                            <Button variant="light" onClick={() => window.open("https://webservices.ulm.edu/flightpath/login", "_blank")}>View</Button>
                        </Col>
                    </Row>
                </Container>

            </>   
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

