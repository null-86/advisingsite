import React, { useState } from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import logout from "../API/SharedFunctions.js";
import './navColor.css'

const NavBar = (location) => {
    return (
        <Navbar bg="custom" expand="lg" className="NavColor">
            <Navbar.Brand style={{color: 'white'}}>{location.location}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" >
                    <Nav.Link href="/" style={{color: 'white'}}>Home</Nav.Link>
                    <Button variant="secondary" onClick={() => logout()}>Logout</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    )
}

export default NavBar;