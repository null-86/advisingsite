import React, { useState } from 'react';
import { Nav, Navbar, Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import logout from "../API/SharedFunctions.js";

const NavBar = (location) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand >{location.location}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" >
                    <Nav.Link href="/">Home</Nav.Link>
                    <Button variant="secondary" onClick={() => logout()}>Logout</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    )
}

export default NavBar;