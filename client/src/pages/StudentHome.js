import React from 'react';
import {Button, Container, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import {Link} from "react-router-dom";
import '../App.css'; // import shared css
import pages from '.';


/* these values are passed into the Body class to populate the semester list,
TODO: it should be possible to add values to this programatically, but I haven't worked on that yet
because we dont know how we will retrieve the data */
const semesters = [
    {
        name: "test 1",
        link: "https://www.reddit.com/r/YouFellForItFool/comments/cjlngm/you_fell_for_it_fool/"
    },

    {
        name: "test 2",
        link: "https://www.reddit.com/r/YouFellForItFool/comments/cjlngm/you_fell_for_it_fool/"
    }
];

// the header of the page
class Header extends React.Component {
    render() {
        return (
                /* currentPage is used to highlight current page */
            <div className="Header" style={{ border: "2px solid black"}}>

                &nbsp; {/* <-- convenient workaround to make font-size scaling more consistent */}
                
                <div  style={{position: "absolute", left: "1%"}}>
                    {this.props.currentPage}
                </div>

                {/**sets navigation options on right side of header */}
                <div  style={{position: "absolute", right: "1%"}}>
                    <table style={{width: "100%", whiteSpace: "nowrap", }}>
                        <tr>
                            {/**first option */}
                            <td style={{paddingRight: "2rem"}}>
                                <a href="https://www.reddit.com/r/YouFellForItFool/comments/cjlngm/you_fell_for_it_fool/" style={{color: "black", textDecoration: "underline"}}>
                                    Home
                                </a></td>
                            {/**second option */}
                            <td> 
                                <a href="https://www.reddit.com/r/YouFellForItFool/comments/cjlngm/you_fell_for_it_fool/" style={{color: "black", textDecoration: "underline"}}>
                                    Student&nbsp;Profile
                                </a></td>
                        </tr>
                        
                    </table>
                </div>
            </div>
        );
    }
}

class Body extends React.Component {
    render() {
        return(
            <Row style={{padding: "0", margin: "0"}}>
            <Col style={{padding: "5%", margin: "0", color: "black", textDecoration: "underline"}}>
                
                {/* Available Actions */}
                <Row className="no-gutters">
                    <Link to={"/schedule"} style={{color: "black", textDecoration: "underline"}} >View Remaining Classes</Link></Row>
                
                <Row className="no-gutters">
                <Link to={"/schedule"} style={{color: "black", textDecoration: "underline"}} >Set Schedule</Link></Row>
                
                <Row className="no-gutters">
                    <Button style={{color: "black", textDecoration: "underline"}} variant="link">View Course Schedule</Button>
                    
                    
                    {/* replace the href when we decide what page these will send the user to */}
                    <DropdownButton variant="secondary" title="Select Semester">
                        
                    {/* dynamically assign buttons and links by passing objects when you creat a Body */}
                        {this.props.semesters.map((sem, i) => {      
                            if (sem != null) {                
                                // return a dropdown item with the link and name provided
                                return (<Dropdown.Item key={i} href={sem.link}>{sem.name}</Dropdown.Item>)
                            }   
                            return null;
                        })}
                        
                    </DropdownButton>

                </Row>
            </Col>
            </Row>
        );
    }
}

const StudentHome = () => {
    return (
        /* set padding=0 to remove whitespace at edge */
        <Container fluid className="no-gutters" style={{padding: "0", margin: "0"}}>
            

            {/** instantiate header and pass name of current page*/}
            <Header currentPage = "Home" />
            
            {/** instantiate body and pass array of semesters (each has a name and a link for the page) */}
            <Body semesters = {semesters}></Body>


        </Container>
    )
}

export default StudentHome;

