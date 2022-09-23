import React from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; // import shared css

class Body extends React.Component {
    render() {
        return (
            <Container>
                <Link to='/advisorhome'><Button style={{ color: "black", textDecoration: "underline" }} >Login as Advisor</Button></Link>
                <Link to='/studenthome'><Button style={{ color: "black", textDecoration: "underline" }} >Login as Student</Button></Link>
            </Container >
        );
    }
}

const GraduateHome = () => {
    return (
        /* set padding=0 to remove whitespace at edge */
        <Container fluid className="no-gutters" style={{ padding: "0", margin: "0" }}>
            <Body></Body>
        </Container>
    )
}

export default GraduateHome;
