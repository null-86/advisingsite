import React, { useState } from 'react';
import { Button, Container, Col, Row, Form, Alert } from 'react-bootstrap';
import API from '../API';
import './Login.css';

// interface declaring all props passed to this component
interface Props {
    access: any
}

// int var;   java
// int var;   js
// function void get()   java
// function get(): any   js

const Login = (props: Props) => {

    // hooks
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const [newUser, setNewUser] = useState("");
    const [newPW, setNewPW] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newCWID, setCWID] = useState("");

    // 
    // const [users, setUsers] = useState("");


    const submit = async () => {
        var isUser = await API.loginAPI.validate(userName, password);

        console.log("isUser: " + JSON.stringify(isUser));

        var email = userName.substr(userName.search("@"));
        if (email === "@warhawks.ulm.edu") {
            console.log("student");
        }
        else if (email === "@ulm.edu") {
            console.log("faculty");
        }

        console.log("\nUsername: " + userName + "\nPassword: " + password);

        if (isUser !== false) {
            props.access();
        }
        else {
            setError(true)
        }

        //props.access();
    }

    const submitNew = async () => {
        console.log("New user\nuser: " + newUser + "\npass: " + newPW + "\nemail: " + newEmail + "\nCWID: " + newCWID);
        API.loginAPI.createNew(newUser, newPW, newEmail, newCWID);
    }
    const viewUsers = async () => {
        API.loginAPI.viewAll().then(data => console.log(data)
        )
        .catch(err => console.error(err))
           
        console.log("here")
    }
    const handleUserName = (e: any) => {
        setUserName(e.target.value);
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value);
    }

    const handleNewUser = (e: any) => {
        setNewUser(e.target.value);
    }

    const handleNewPW = (e: any) => {
        setNewPW(e.target.value);
    }


    const handleNewEmail = (e: any) => {
        setNewEmail(e.target.value);
    }

    const handleNewCWID = (e: any) => {
        setCWID(e.target.value);
    }
   
    return (
        <>
            <Container className="Login">
                <h2>Sign In</h2>
                <Form>
                    <Col>
                        <Form.Group controlId="userName">
                            <Form.Label>User Name:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter ULM email"
                                onChange={(e: any) => handleUserName(e)} />
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

                    <Button variant="primary" onClick={() => submit()}>Submit</Button>
                    {error ?
                        <Alert variant="danger">Email or password is incorrect.</Alert>
                        :
                        <></>
                    }
                </Form>
            </Container>

            <Container className="NewUser">
                <h2>Create New User</h2>
                <Form>
                    <Col>
                        <Form.Group controlId="newUser">
                            <Form.Label>Enter User Name:</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Enter ULM username"
                                onChange={(e: any) => handleNewUser(e)} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="newPW">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e: any) => handleNewPW(e)} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter ULM email"
                                onChange={(e: any) => handleNewEmail(e)} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="cwid">
                            <Form.Label>CWID:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter ULM CWID"
                                onChange={(e: any) => handleNewCWID(e)} />
                        </Form.Group>
                    </Col>

                    <Button variant="primary" onClick={() => submitNew()}>Submit</Button>
                    {error ?
                        <Alert variant="danger">Email or password is incorrect.</Alert>
                        :
                        <></>
                    }

                   
                </Form>

            </Container>

            <Container className="NewUser">
            <Form>
               <h5> Click to Show all the registered users</h5>
                <Button variant="primary" onClick={() => viewUsers()}>View all Users</Button>
            </Form>

            </Container>
        </>
    );
}

export default Login;