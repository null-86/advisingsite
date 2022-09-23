import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import { LINK } from '../API/constants';
import 'react-calendar/dist/Calendar.css';
import Accordion from 'react-bootstrap/Accordion';
import db from '../API/ApptAPI'
import { IntegratedEditing, EditingState, ViewState } from '@devexpress/dx-react-scheduler';
import {
    DateNavigator,
    Scheduler,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    TodayButton,
    Toolbar,
    ViewSwitcher,
    MonthView,
    DayView,
} from '@devexpress/dx-react-scheduler-material-ui';
import appt from '../classes/appt';
import moment from "moment";
//import TimePicker from 'react-dropdown-timepicker';

// timekeeper is super slow, not sure if it's a bug or what
//import Timekeeper from 'react-timekeeper';

// for timepicker on appt creation
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import 'react-times/css/classic/default.css';

// for datepicker on appt creation
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { TimePicker, Input } from 'antd';
// import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
//import AppointmentPopup  from '../classes/AppointmentPopup';
//import customApptEdit from '../classes/customApptEdit';
//import { toggleVisibility } from '@devexpress/appointment-form'

// time select dropdown
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Input } from '@material-ui/core';


class AdvisorAppointment extends React.Component {
    constructor(props) {
        super(props);
        // this.schedule = React.createRef();
        // this.week = React.createRef();
        this.state = {
            advisorCwid: props.advisorCwid,
            zmLink: "",
            savedZoomLink: '',
            schedule: [{}], // this.schedulerData
            // appt creation
            // yr: null,
            // mnth:null,
            // dayNum: null,
            // startTime: "0000",
            // endTime: "0000",
            startHr: "00",
            startMin: "00",
            startMeridiem: "AM",
            endHr: "00",
            endMin: "00",
            endMeridiem: "AM",
            selectedDate: null,
            interval: "0",
            location: null

            // showAlert: false
        };

        // I think this shares the class's this scope with the AppointmentPopup's function scope
        // effectively allowing AppointmentPopup to set global state variables (those above)
        this.AppointmentPopup = this.AppointmentPopup.bind(this);
    }


    // this is apparently deprecated, but since it works I don't care
    // it allows me to load appts before the screen loads. Omitting this leaves the 
    // calendar blank
    componentDidMount() {
        this.getSchedulerData(); 
        this.getZoomLink(this.state.advisorCwid);
    }

    getZoomLink = async (adCwid) => {
        var link =  await db.getLink(adCwid);
        
        //console.log('Da link: ',link);
        this.setState({
            savedZoomLink: link.zoomLink
         })

    }

    postLink = () => { 

        let response = {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: this.state.advisorCwid, link: this.state.zmLink }) //creating JSON object
        }

        console.log(this.state.advisorCwid + " " + this.state.zmLink)
        fetch(LINK + '/api/zoomLink/', response)

    }

    getSchedulerData = async () => {

        //// load appointments
        // date ? miliseconds before current
        var startDate = new Date(new Date().getTime() - 17280000000);
        // date ? miliseconds after current
        var endDate = new Date(new Date().getTime() + 17280000000);

        var appts = [];
        var res = await this.getAdvisorAppointmentsByDateRange(this.state.advisorCwid, startDate, endDate)
        // console.log(res);

        // parse 
        Object.keys(res).forEach(function (key) {
            var val = res[key];

            appts.push(new appt(val.id, val.advisorCwid, val.studentCwid, val.yr,
                val.mnth, val.dayNum, val.startTime, val.endTime, val.location, val.title));
        });

        // convert to schedule items
        var scheduleItems = [];
        appts.forEach((e) => {
            // console.log(e);
            scheduleItems.push(e.getScheduleItem());
        });

        // reset to empty (prevents duplication when refreshing)
        this.setState({ schedule: [{}] });

        // console.log("refresh");
        this.setState({ schedule: this.state.schedule.concat(scheduleItems) })
        //console.log(this.state.schedule);
    }

    // wrapper around database call; it isn't strictly necessary since it's only one line, but this gives me flexibility later
    getAdvisorAppointmentsByDateRange = async (advisorCwid, startDate, endDate) => {
        var res = await db.getAdvisorAppointmentsByDateRange(advisorCwid, startDate.getTime(), endDate.getTime());
        return res;
    }

    //splitApptsWrapper = async (total, increment) => {
    splitApptsWrapper = async () => {
        // divide time period based on interval and set appts
        var apptArr = await this.splitAppts();
        // total(apptArr.length);
        Array.from(apptArr).forEach((appt) => {
            // console.log("wrapper")
            // console.log(
            //     this.state.advisorCwid, 
            //     this.state.selectedDate.getFullYear(), 
            //     this.state.selectedDate.getMonth() + 1, // getMonth is zero-indexed, but our db is 1-indexed
            //     this.state.selectedDate.getDate(), 
            //     appt.startTime, 
            //     appt.endTime,
            //     this.state.location
            //     );
            // awaiting each setAppt is kinda janky, but it's too late to 
            // rebuild the db code. Basically, sending all of these requests
            // simultaneously puts the db code in a situation where it cannot reliably
            // call LAST_INSERT_ID(). Instead, multiple entries call this at the same
            // time. This creates duplicate primary keys stopping random entries from being 
            // input into db
            db.setAvailableAppointment(
                this.state.advisorCwid,
                this.state.selectedDate.getFullYear(),
                this.state.selectedDate.getMonth() + 1, // getMonth is zero-indexed, but our db is 1-indexed
                this.state.selectedDate.getDate(),
                appt.startTime,
                appt.endTime,
                this.state.location
            );
            // increment();
        })
    }

    splitAppts = async () => {
        // storage for appts
        var appts = [];

        // convert needed values into ints
        var startTime = parseInt(this.getTime(true));
        var endTime = parseInt(this.getTime(false));
        var appt = {};

        // return initial values
        if (this.state.interval == "0") {
            appt.startTime = startTime;
            appt.endTime = endTime;
            appts.push(appt);
        }
        // else split times
        else {
            // I'll pre-apologize to anyone who has to maintain this. 
            // I can't think of better var names
            var time = startTime;
            while (parseInt(time) < parseInt(endTime)) {
                appt = {}; // reset object
                appt.startTime = time.toString().padStart(4, "0"); // set startTime

                // find nextTime after interval
                time = this.getNextTime(time, this.state.interval);

                // assign to endTime
                appt.endTime = time;

                if (appt.endTime <= endTime) {
                    appt.endTime = appt.endTime.toString().padStart(4, "0");
                    appts.push(appt);
                }
            }
        }
            
        console.log('All the appointments', appts)
        return appts;
        }


    // if isStart == true, use startTime; if false, use endTime
    getTime(isStart) {
        var hr, min, meridiem;

        if (isStart) {
            hr = parseInt(this.state.startHr);
            min = parseInt(this.state.startMin);
            meridiem = this.state.startMeridiem.toString();
        }
        else {
            hr = parseInt(this.state.endHr);
            min = parseInt(this.state.endMin);
            meridiem = this.state.endMeridiem.toString();
        }

        // console.log(hr, min, meridiem);

        // // unique logic for when endTime == 12am
        // if (!isStart && hr == )


        // handle min
        var carry = Math.floor(min / 60);
        min = min % 60;

        // handle hr
        hr += carry;

        // handle meridiem
        if (meridiem.toUpperCase() == "AM") {
            if (hr >= 12) {
                hr -= 12;
            }
        }
        else if (meridiem.toUpperCase() == "PM") {
            if (hr < 12) {
                hr += 12;
            }
        }
        else {
            console.log("meridiem was improperly set");
        }

        // normalize and convert to string
        hr = hr.toString().padStart(2, "0");
        min = min.toString().padStart(2, "0");

        var time = hr + "" + min;
        // last second checks to prevent ui breaking cases

        // 2400+ breaks the ui
        var test = parseInt(time);
        if (test >= 2400) {
            time = "2359";
        }
        // endTime of 12am breaks ui
        else if (test == 0 && !isStart) {
            time = "2359";
        }

        return time;
    }


    // get the time after a certain number of mins (defined by step)
    getNextTime(time, step) {
        // normalize and parse everything into an easier form to manipulate
        time = time.toString();
        while (time.length < 4) {
            time = "0" + time;
        }
        var hr = parseInt(time.substring(0, 2));
        var min = parseInt(time.substring(2, 4));
        step = parseInt(step);


        min += step;

        var carry = Math.floor(min / 60);
        hr += carry;
        min = Math.floor(min % 60);

        hr = hr.toString();
        min = min.toString();

        // some of this normalization is redundant, but i don't care at this point
        while (hr.length < 2) {
            hr = "0" + hr;
        }

        while (min.length < 2) {
            min = "0" + min;
        }

        time = hr + min;

        while (time.length < 4) {
            time = "0" + time;
        }

        return time;
    }

    handleSave = async (refreshCallback) => {
        // console.log("handle save")
        // var total = 0;
        // var count = 0;
        await this.splitApptsWrapper(
            // retrieves the total number of appts
            // function(val) {
            // total = val;
            // console.log("total " + total)
            // },

            // increments count after an appt has been sent to db
            // function() {
            // count++;
            // console.log("count " + count)
            // }
        ).then(function () {
            // refresh calendar
            // console.log("polling")

            // function delay() {
            //     console.log("delay")
            //     if (count < total) {
            //         setTimeout(delay, 100);
            //     }
            //     else {
            //         console.log("calling refresh")
            //         refreshCallback();  
            //     }
            // }

            // delay();
            // console.log("calling refresh", Date.now())
            // delay refresh to give db time to input appts
            alert("Calendar will refresh shortly");
            setTimeout(function () {
                refreshCallback()
            }, 3000);
        });
    }

    handleDelete = async (deleted, refreshCallback) => {
        await db.deleteTimeSlot(deleted).then(function () {
            // refresh calendar
            refreshCallback();
        });
    }

    // called by the platform. We then handle the changes accordingly
    // adds and deletes appts
    commitChanges = async (changes) => {
        if (changes) {

            if (changes.added) {
                // console.log(this.state.advisorCwid, this.state.selectedDate, this.getTime(true), this.getTime(false));
                if (this.state.advisorCwid == null || this.state.selectedDate == null || this.getTime(true) == null
                    || this.getTime(false) == null || this.getTime(true) == this.getTime(false)) {
                    console.log("field improperly filled out");
                    return;
                }
                if (parseInt(this.getTime(true)) >= parseInt(this.getTime(false))) {
                    console.log("end time must come after start time")
                }

                // pass the refresh function as a callback 
                await this.handleSave(this.getSchedulerData);


                // reset state vars
                // make sure to await handleSave, or else it'll corrupt the data while it's saving
                this.setState({
                    startHr: "00",
                    startMin: "00",
                    startMeridiem: "AM",
                    endHr: "00",
                    endMin: "00",
                    endMeridiem: "AM",
                    selectedDate: null,
                    interval: "0",
                    location: null
                })
            }

            // pass the refresh function as a callback  
            if (changes.deleted) {
                this.handleDelete(changes.deleted, this.getSchedulerData);
            }
        }

    }

    hour = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
    ]
    minute = [
        "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"
    ]
    meridiem = [
        "AM", "PM"
    ]
    interval = [
        { value: "0", label: "Any Length" },
        { value: "5", label: "5 min" },
        { value: "10", label: "10 min" },
        { value: "15", label: "15 min" },
        { value: "20", label: "20 min" },
        { value: "25", label: "25 min" },
        { value: "30", label: "30 min" },
        { value: "35", label: "35 min" },
        { value: "40", label: "40 min" },
        { value: "45", label: "45 min" },
        { value: "50", label: "50 min" },
        { value: "55", label: "55 min" },
        { value: "60", label: "60 min" }
    ]

     
    
    // I tried to move this to another class, but I could not figure out how to send data to it under the framework I'm using
    AppointmentPopup(props) {
        // these hooks seem redundant, but they're the only way i could find to update the ui realtime
        const [selectedDate, setSelectedDate] = useState(props.appointmentData.startDate);
        // const [startTime, setStartTime] = useState(this.state.);
        // const [endTime, setEndTime] = useState("0000");

        // set state vars, otherwise it will not be set if the user does not change the date
        this.state.selectedDate = selectedDate;
        // this.state.startTime = startTime;
        // this.getTime(false) = endTime;

        // these handlers update global vars
        const handleStartTime = async (e) => {
            if (e[0] == "hour") {
                this.setState({ startHr: e[1].value });
            }
            if (e[0] == "minute") {
                this.setState({ startMin: e[1].value });
            }
            if (e[0] == "meridiem") {
                this.setState({ startMeridiem: e[1].value });
            }
        }

        const handleEndTime = async (e) => {
            if (e[0] == "hour") {
                this.setState({ endHr: e[1].value });
            }
            if (e[0] == "minute") {
                this.setState({ endMin: e[1].value });
            }
            if (e[0] == "meridiem") {
                this.setState({ endMeridiem: e[1].value });
            }
        }

        const handleSelectedDate = async (e) => {
            if (e) {
                this.setState({ selectedDate: e })
                setSelectedDate(e)
            }
        }

        const handleInterval = async (e) => {
            this.setState({ interval: e.value });
        }

        const handleLocation = async (e) => {
            if (e.target.value) {
                this.setState({ location: e.target.value });
            }

        }

        

        

        return (


            <Container className="no-gutters" style={{ width: "100%", padding: "1%", textAlign: "left", backgroundColor: "#f5f5f4c9" }}>
                <Col className="no-gutters" style={{ width: "100%", padding: "1%" }}>
                    <Form.Label>Create Appointment</Form.Label><br /><br />



                    {/* make a grid with date on top row, 2 time pickers on 2nd row, and a duration/interval on bottom row */}
                    {/* https://reactjsexample.com/a-time-picker-react-component-no-jquery-rely/ */}

                    Date:&nbsp;
                    <DatePicker style={{ width: "100%", padding: "1%" }}
                        selected={selectedDate}
                        onChange={(e) => handleSelectedDate(e)}
                    />

                    <Col className="no-gutters" style={{ width: "100%", padding: "1%" }}>
                        <br />Start&nbsp;Time
                        <Row className="no-gutters" style={{ width: "100%", alignItems: "center" }}>
                            <Dropdown options={this.hour} onChange={(e) => handleStartTime(["hour", e])} value={"0"} placeholder={"0"} />
                            <Dropdown options={this.minute} onChange={(e) => handleStartTime(["minute", e])} value={"00"} placeholder={"00"} />
                            <Dropdown options={this.meridiem} onChange={(e) => handleStartTime(["meridiem", e])} value={"AM"} placeholder={"AM"} />
                        </Row>
                    </Col>
                    <Col className="no-gutters" style={{ width: "100%", padding: "1%" }}>
                        End&nbsp;Time
                        <Row className="no-gutters" style={{ width: "100%", alignItems: "center" }}>
                            <Dropdown options={this.hour} onChange={(e) => handleEndTime(["hour", e])} value={"0"} placeholder={"0"} />
                            <Dropdown options={this.minute} onChange={(e) => handleEndTime(["minute", e])} value={"00"} placeholder={"00"} />
                            <Dropdown options={this.meridiem} onChange={(e) => handleEndTime(["meridiem", e])} value={"AM"} placeholder={"AM"} />
                        </Row>

                    </Col><br />
                    <Col className="no-gutters" style={{ width: "100%", padding: "1%" }}>
                        Appointment&nbsp;Length
                        <Row className="no-gutters" style={{ width: "100%", alignItems: "center" }}>
                            <Dropdown options={this.interval} onChange={(e) => handleInterval(e)} value={"0"} placeholder={"Any Length"} />
                        </Row>
                    </Col><br />
                    {/* <Col className="no-gutters" style={{width: "100%", padding: "1%"}}>
                        Location
                        <Form.Control onChange={(e) => handleLocation(e)} type="text" placeholder="Where's the meeting?" />
                    </Col> */}
                </Col>

            </Container>
        );

    }


    render() {
        return (
            <Container style={{ backgroundColor: "#f5f5f4c9" }}>

                {/* This alert is way too much work for a blackmailed project */}
                {/* <Alert key={this.state.showAlert} variant="warning" dismissible>
                    The calendar will refresh momentarilly.
                </Alert> */}
                {/* <Header></Header> */}

                {/* // https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/ 
                 -- this calendar is free to use for non-profit institutions */}

                <Scheduler
                    data={this.state.schedule}
                    height={"auto"}
                    //onclick={(e) => console.log(e)}
                >

                    <ViewState
                        defaultCurrentDate={new Date()} // this is probably done automatically, but I'm doing explicitly anyway
                        defaultCurrentViewName={'Month'}
                    // currentViewName={currentViewName}
                    // onCurrentViewNameChange={this.currentViewNameChange}
                    />

                    <MonthView
                    />

                    <WeekView
                        startDayHour={0}
                        endDayHour={24}
                    />

                    <WeekView
                        name="work-week"
                        displayName="Work Week"
                        excludedDays={[0, 6]}
                        startDayHour={0}
                        endDayHour={24}
                    />

                    <DayView
                        startDayHour={0}
                        endDayHour={24}
                    />

                    <Toolbar flexibleSpaceComponent={Toolbar.FlexibleSpace} />
                    <Toolbar.FlexibleSpace>
                        <br />
                        
                        
                        
                        


                        <Accordion defaultActiveKey="0">
                        
                            <Card>
                                <Card.Header style={{display: 'flex',
                                                    'justifyContent': 'center',
                                                    'alignItems': 'center'}}>
                                    <Accordion.Toggle as={Button} variant="outline-info" size="sm"   eventKey="1" style={{
                                                           margin : '0.5em'
                                                        }}>
                                        Zoom Link
                                        
                                    </Accordion.Toggle>
                                    <Button  variant="outline-info" size="sm" onClick={() => window.open(this.state.savedZoomLink, "_blank")}>
                                        Visit Zoom Meeting
                                    </Button>
                                    
                                    <Button size='sm' onClick={this.getSchedulerData}  variant="outline-success" style={{margin : '1em'}}>
                                        Refresh Appointments
                                    </Button>
                                </Card.Header>

                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Form>
                                            <Col>
                                                <Form.Group controlId="link">
                                                    <Form.Label>Current Zoom Link:</Form.Label>
                                                    <Form.Control
                                                        type="link"
                                                        placeholder={this.state.savedZoomLink}
                                                        />
                                                    <Form.Label>Create/Update Zoom Link:</Form.Label>
                                                    <Form.Control
                                                        type="link"
                                                        placeholder="Paste Zoom link here"
                                                        onChange= {(e) => this.setState( {zmLink: e.target.value})}
                                                        />
                                                </Form.Group>
                                                <Button variant="secondary" style={{'backgroundColor': '#440000'}} onClick={() => { this.postLink() }}>Submit</Button>
                                            </Col>
                                            
                                         </Form>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>

                    </Toolbar.FlexibleSpace>

                    <DateNavigator />
                    <TodayButton />
                    <ViewSwitcher />
                    <Appointments />
                    {/* <Resources  /> */}
                    <EditingState onCommitChanges={this.commitChanges} />
                    <IntegratedEditing />
                    <AppointmentTooltip
                        showCloseButton
                        showDeleteButton
                    // does nothing :(
                    // https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
                    // onDeleteButtonClick={this.commitDelete}
                    />

                    <AppointmentForm
                        // onVisibilityChange={this.handleApptChange}
                        //  commandButtonComponent={this.emptyComponent}
                        basicLayoutComponent={this.AppointmentPopup}
                    // onAppointmentDataChange={this.handleApptChange}
                    // visible={true}                        
                    />




                    {/* https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/reference/appointment-form/ */}

                    {/* <AppointmentForm textEditorComponent={new AppointmentPopup(
                        this.state.advisorCwid,
                        (getSchedulerData) => this.handleAddAppt(this.getSchedulerData),
                        "Create Appointment")}/>  */}
                </Scheduler>
            </Container>
        );
    }
}






export default AdvisorAppointment;


// {/* <TimePicker timeMode={"12"} style={{overflow: "visible"}} /> */}
//                         {/* <TimePicker 
//                             //theme={"classic"}
//                             timeMode={"12"}
//                             // timeFormat={"hh:mm"}
//                             minuteStep={5}
//                             time={startTime}
//                             onTimeChange={(e) => handleStartTime(e)}
//                         /> */}