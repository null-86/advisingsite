
import React, {useState} from 'react';
import { Button, Col, Container, Form, Nav, Navbar, Row,  Modal } from 'react-bootstrap';
import db from '../API/ApptAPI'
import {DateNavigator} from '@devexpress/dx-react-scheduler-material-ui';
import Appt from '../classes/appt';
class AppointmentPopup extends React.Component {
    constructor( ...rest) {
      super(...rest);
      this.state = {
      //   // the title/header of the popup
       //header: rest.header,
        
        advisorCwid: rest[0],
        getSchedulerData: rest[1],
        header: rest[2],

        // appt variables
        //advisorCwid: props.advisorCwid,
        yr: null,
        mnth: null,
        dayNum: null,
        startTime: null,
        endTime: null,

        // use this callback to force appt calendar to refresh
        // not implemented yet
        //callback: props.callback,


        isOpen: false,
      }
      
      // for (var key in rest) {
      //   console.log(rest[key]);
      // }

    }

    handleClose = () => this.setState({isOpen: false});
    handleOpen = () => this.setState({isOpen: true});
    
    handleSave = async () => {
      console.log(this.state.advisorCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
      if (this.state.advisorCwid == null || this.state.yr == null || this.state.mnth == null || this.state.dayNum == null || this.state.startTime == null || this.state.endTime == null) {
        this.handleClose();
        return;
      }
      
      await this.setAvailableAppointment();
      await this.state.getSchedulerData();
      this.handleClose();
    }

    handleYr = (e) => {
      if (e.target.value) {
          this.setState({yr: e.target.value});
      }
    }

    handleMnth = async (e) => {
        if (e.target.value) {
            this.setState({mnth: e.target.value});
        }
    }

    handleDayNum = async (e) => {
        if (e.target.value) {
            this.setState({dayNum: e.target.value});
        }
    }

    handleStartTime = async (e) => {
        if (e.target.value) {
            this.setState({startTime: e.target.value});
        }
    }

    handleEndTime = async (e) => {
        if (e.target.value) {
            this.setState({endTime: e.target.value});
        }
    }

    handleAdvisorCwid = async (e) => {
        if (e.target.value) {
            this.setState({advisorCwid: e.target.value});
        }
    }

    handleStudentCwid = async (e) => {
        if (e.target.value) {
            this.setState({studentCwid: e.target.value});
        }
    }




    setAvailableAppointment = async () => {
      // console.log(this.state.advisorCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
      
      await db.setAvailableAppointment(this.state.advisorCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
      
      // // get added appt data to refresh schedule
      // var res = await db.getAdvisorAppointments(this.state.advisorCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
      // res = res[0]; // because we're using the exact time and date, there will only be one value in the array
      
      // var appt = new Appt(res.cwid, res.advisorCwid, res.studentCwid, res.yr, res.mnth, res.dayNum, res.startTime, res.endTime, res.location);
      
      // return appt;
    }


    render() {
        return (
           
      <Container>
        <Button variant="primary" onClick={this.handleOpen}>
          {this.state.header}
        </Button>
  
        <Modal
          show={this.state.isOpen}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Appointment</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <Form.Group>
              <Row>            
                {/* <Form.Label>advisorcwid</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleAdvisorCwid(e)} /> */}
                <Form.Label>yr</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleYr(e)}/>
                <Form.Label>mnth</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleMnth(e)}/>
                <Form.Label>dayNum</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleDayNum(e)}/>
                <Form.Label>startTime</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleStartTime(e)} />
                <Form.Label>endTime</Form.Label>
                <Form.Control type="text"  onChange={(e) => this.handleEndTime(e)} />
              </Row>
              <Row>
                  {/* <Button variant="primary" onClick={() => this.setAvailableAppointment()}> setappt</Button> */}
                  {/* <Button variant="primary" onClick={() => this.setAdvisorFreetime()}> setfree</Button> */}
                  {/* <Button variant="primary" onClick={() => this.getAdvisorFreetime()}> getfree</Button> */}
                  {/* <Button variant="primary" onClick={() => this.getAdvisorAppointments()}> getadvappt</Button> */}
                  {/* <Button variant="primary" onClick={() => this.getSharedAppointments()}> getshared</Button> */}
                  {/* <Button variant="primary" onClick={() => this.testDB()}> Run all tests</Button> */}
              </Row>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default AppointmentPopup;