import React, { useState } from 'react';
import {Button, Container, Col, Card, Row, Form, Alert, Nav, Image, Navbar, NavbarBrand } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../API';
import CookieService from '../API/CookieService';
import './Login.css';
import { COOKIE_LIFETIME, CLIENT_ROOT } from '../API/constants';
import { Divider } from '@material-ui/core';
import { CenterFocusStrong } from '@material-ui/icons';

// interface declaring all props passed to this component
interface Props {
    access: any,
    getUser: any
}

// int var;   java
// int var;   js
// function void get()   java
// function get(): any   js

const Login = (props: Props) => {

    // hooks
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    //const [acctType, setAcctType] = useState("");

    // 
    // const [users, setUsers] = useState("");
    //var userDetails;
    var detailsAcctType = "";
    var detailsID = "";
    var detailsUsername = "";

    const submit = async () => {
        var isUser = await API.loginAPI.validate(email, password);
        ////// console.log("here", isUser[0]);

        //var userDetails = await API.loginAPI.getUserDetails(email);

        //detailsEmail = userDetails.email;
        // //// console.log("isUser: " + JSON.stringify(isUser[0]));

        // //// console.log("\nUsername: " + email + "\nPassword: " + password);

        if (isUser !== false) {
            // //// console.log("here", isUser);

            detailsAcctType = isUser[0].acctType;
            detailsID = isUser[0].cwid;
            detailsUsername = isUser[0].fName + " " + isUser[0].lName;
            props.access();
            props.getUser(isUser[0]);

            // user is verified; now set user-cookie
            setCookie();
            // move to home page (removing this makes login require 2 presses [this is a workaround])        
            window.location.assign(CLIENT_ROOT);
            window.location.reload(true);

        }
        else {
            setError(true)
        }

        //props.access();
    }



    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value);
    }

    // Keeping the last container in here for testing purposes!
    return (
        <>  
        <Card>
            <span className= "LoginHeader">
            <Card.Header as="h5" style = {{ width: "23rem"}}> <Card.Img variant="top" src="./ulm.png" /></Card.Header>
            </span>


            <Container>
                <Row>

                <Col sm={7} className="Login" >
                        <h2>Sign In</h2>
                        <Form>
                            <Col>
                                <Form.Group controlId="email">
                                    <Form.Label>ULM Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter ULM email"
                                        onChange={(e: any) => handleEmail(e)} />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e: any) => handlePassword(e)} />
                                </Form.Group>
                            </Col>

                            <Button style={{backgroundColor: "#480B0B"}} variant="secondary" onClick={() => submit()}>Submit</Button>
                            {error ?
                                <Alert variant="danger">Email Or Password Is Incorrect.</Alert>
                                :
                                <></>
                            }

                        </Form>
                    </Col>

                    <Col sm={2} className="Links">
                        <Row className="Subheader">
                            Not What You're Looking For?
                        </Row>

                        <Row className="Linkrow">
                            <Button variant="light" style={{ color: "white", backgroundColor: "#480B0B", opacity: "0.7"}} onClick={() => window.open("https://www.ulm.edu/")}>Our Main Website</Button>
                        </Row>

                        <Row className="Linkrow">
                            <Button variant="light" style={{ color: "white", backgroundColor: "#480B0B", opacity: "0.7"}} onClick={() => window.open("https://my.ulm.edu/")}>MyULM Portal</Button>
                        </Row>

                        <Row className="Linkrow">
                            <Button variant="light" style={{ color: "white", backgroundColor: "#480B0B", opacity: "0.7"}} onClick={() => window.open("https://moodle.ulm.edu/")}>Moodle Portal</Button>
                        </Row>

                        <Row className="Linkrow">
                            <Button variant="light" style={{ color: "white", backgroundColor: "#480B0B", opacity: "0.7"}} onClick={() => window.open("https://banner.ulm.edu/")}>Banner Self-Service</Button>
                        </Row>

                        <Row className="Linkrow">
                            <Button variant="light" style={{ color: "white", backgroundColor: "#480B0B", opacity: "0.7"}} onClick={() => window.open("https://webservices.ulm.edu/flightpath/login")}>Flightpath Login</Button>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </Card>

            {/* <Container className="NewUser">
                <Form>
                    <h5> Click to Show all the registered users</h5>
                    <Button variant="primary" onClick={() => viewUsers()}>View all Users</Button>
                </Form>

            </Container> */}
        </>
    );

    // making this async since nothing depends on it. no reason to bog down the browser
    async function setCookie() {

        // convert cookie_lifetime from hrs to ms
        var milliseconds = Math.round(COOKIE_LIFETIME * 3600000);

        // create date object for designated time in future
        var expireDate = new Date(Date.now() + milliseconds);
        ////// console.log("logintsx acctType cookie funct " + detailsAcctType);
        var options = { expires: expireDate, sameSite: "lax" };
        CookieService.set('user-cookie',
            JSON.stringify(
                {
                    username: detailsUsername,
                    email: email,
                    id: detailsID,
                    acctType: detailsAcctType,
                    verified: true // this code cannot be reached (normally) unless this is true
                }),
            options);

        ////// console.log("user-cookie set");
    }

}




export default Login;