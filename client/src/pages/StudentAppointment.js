import React from 'react';
//import { Switch, Route, BrowserRouter, withRouter, Router } from 'react-router-dom';
//import { CALENDLY_KEY } from "../API/constants.js"
import { Button, Col, Container, Form, Nav, Navbar, Row } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import logout from '../API/SharedFunctions.js';
import Calendar from 'react-calendar';
import { DatePicker, TimePicker, Input } from 'antd';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import db from '../API/ApptAPI';

import { LINK } from '../API/constants';
import {AppointmentFormProps,  IntegratedEditing, EditingState, EditingStateProps, ViewState } from '@devexpress/dx-react-scheduler';
import {
    DragDropProvider,
    ConfirmationDialog,
    DateNavigator,
    Scheduler,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentTooltipProps,
    AppointmentForm,
    Resources,
    
    TodayButton,
    Toolbar,
    ViewSwitcher,
    MonthView,
    DayView,
    currentViewName,
} from '@devexpress/dx-react-scheduler-material-ui';
import appt from '../classes/appt';
//import  CustomTooltip  from '../classes/CustomTooltip';



var timeFormat = "HH:mm";


class StudentAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentCwid: props.studentCwid,
            advisorCwid: null,
            schedule: [{}], // this.schedulerData
            zoomLink: '', 
            advisorName: ''
        };
        this.CustomTooltip = this.CustomTooltip.bind(this);
        
        
        
        //zoom fetch
        // const [zoomLink, setZoomLink] = useState('');

        // useEffect(() => {
        //     let res = {
        //         method: "POST",
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ cwid:  props.studentCwid }) //creating JSON object
        //     }
        //     fetch(LINK + "/api/retrieveZoomLink/", res)
        //         .then((response) => response.json())
        //         .then((data) => setZoomLink(data))
        // }, []);



    }

    componentDidMount() {
        // get advisor
        this.getAdvisorCwid(this.state.studentCwid)
            .then(() => {
                // get appointments available for student
                this.getSchedulerData();
                this.getZoomLink(this.state.advisorCwid);
            });


        // this.getZoomLink(this.state.studentCwid);
        
        
    }

     getZoomLink = async (adCwid) => {
        var link =  await db.getLink(adCwid);
        
        //console.log('Da link: ',link);
        this.setState({
            zoomLink: link.zoomLink,
            advisorName: link.advName
         })

    }

    getAdvisorCwid = async (studentCwid) => {
        var res = await db.getAdvisor(studentCwid);
        // console.log(res);
        this.setState({advisorCwid: res});
    }
    
  
    getSchedulerData = async () => {
        
        // console.log("getting scheduler data");

        //// load appointments
        // date ? miliseconds before current
        var startDate = new Date(new Date().getTime() - 17280000000);
        // date ? miliseconds after current
        var endDate = new Date(new Date().getTime() + 17280000000);

        var appts = [];
        var res = await this.getStudentAvailableAppointmentsByDateRange(this.state.advisorCwid, this.state.studentCwid, startDate, endDate)
        // console.log(res);
        
        // parse 
        Object.keys(res).forEach(function(key) {
            var val = res[key];

            appts.push(new appt(val.id, val.advisorCwid, val.studentCwid, val.yr,
                val.mnth, val.dayNum, val.startTime, val.endTime, val.location, val.title));
        }); 


        //// pull freetime from db
        // only implement if we have enough time


        //// merge 
        

        //// add to schedule list
        
        // convert to schedule items
        var scheduleItems = [];
        appts.forEach(e => {
            var item = e.getScheduleItem()

            if (item.studentCwid == this.state.studentCwid || item.studentCwid == null) {
                scheduleItems.push(item);
                //console.log(item);
            }
            
         
        });
       

        // reset to empty
        this.setState({schedule: [{}]  });

        this.setState({schedule: this.state.schedule.concat(scheduleItems)});

        
        //console.log(this.state.schedule);
    }


    // // student functionality
    // getStudentAppointments = async () => {
    //     var res = await db.getStudentAppointments(this.state.studentCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);

    //     this.handleOutput(res);
    //     return res;
    // }



    getStudentAvailableAppointmentsByDateRange = async (advisorCwid, studentCwid, startDate, endDate) => {
        return await db.getStudentAvailableAppointmentsByDateRange(advisorCwid, studentCwid, startDate.getTime(), endDate.getTime());
    }

    // getAdvisorAppointments = async (useNullStudent) => {

    //     var res;

    //     if (useNullStudent) {
    //         // use null to avoivd displaying names of other students
    //         res = await db.getSharedAppointments(this.state.advisorCwid, "null", this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
    //     } else {
    //         res = await db.getSharedAppointments(this.state.advisorCwid, this.state.studentCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
    //     }

    //     console.log(res);
    //     return res;
    // }
    
 

    // getAdvisorFreetime = async () => {
    //     var res = await db.getAdvisorFreetime(this.state.advisorCwid, this.state.yr, this.state.mnth, this.state.dayNum, this.state.startTime, this.state.endTime);
    //     this.handleOutput(res);
    //     return res;
    // }



    // student and advisor can access
    // don't need to call directly; student should call getAdvisorAppointments
    // don't use
    // getSharedAppointments = async () => {
    // var res = await db.getSharedAppointments(this.state.advisorCwid, this.state.studentCwid);
    // this.handleOutput(res);
    // return res;
    // }
    
    // TooltipProps = {
    //     callback: this.getSchedulerData,
    //     studentCwid: this.state.studentCwid
    // }


    CustomTooltip(props) {
        // console.log(props);
        var id = props.appointmentData.id;
        var studentCwid = this.state.studentCwid;

        
        const assignStudentToAppointment = async (studentCwid, id) => {
            // console.log("assign " + studentCwid + ' to ' + id); 
            await db.assignStudentToAppointment(studentCwid, id).then(() => {
                // console.log(studentCwid)
                this.getSchedulerData();
                props.onHide();
                return;
            });
        }
        
        const unassignStudentFromAppointment = async (studentCwid, id) => {
            // console.log("unassign " + studentCwid + ' from ' + id);
            await db.unassignStudentFromAppointment(studentCwid, id).then(() => {
                this.getSchedulerData();
                props.onHide();
                return;
            });
            
        }

    
       
        

        const handleUnassign = () => {
            unassignStudentFromAppointment(studentCwid, id);
        }

        const handleAssign = () => {
            assignStudentToAppointment(studentCwid, id);
        }
        
        // the top row of the appointmentTooltip 
        return (
            <Row>
                <Button variant="link" onClick={handleAssign}>Assign</Button>
                <Button variant="link" onClick={handleUnassign}>Unassign</Button>
                
            </Row>
        )
    }


   




    render() {
        return (
            <Container style={{ backgroundColor: "#f5f5f4c9" }}>
                
                   <br/>
                <Scheduler 
                    data={this.state.schedule}
                    height={"auto"}
                    
                >
                    
                    <ViewState
                        defaultCurrentDate={new Date()} // this is probably done automatically, but I'm doing explicitly anyway
                        defaultCurrentViewName={'Month'}
                        // currentViewName={currentViewName}
                        // onCurrentViewNameChange={this.currentViewNameChange}
                    />
                    <MonthView  />

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
                    <Toolbar.FlexibleSpace style={{display: 'flex',
                                                    'justifyContent': 'center',
                                                    'alignItems': 'center'}}>
                        <Button  variant="outline-info" size="lg" onClick={() => window.open(this.state.zoomLink, "_blank")}>
                            Attend Advisor {this.state.advisorName}'s Zoom Meeting
                        </Button>
                    {/* <AppointmentPopup addAppt={(appt) => this.handleAddAppt(appt)} header={"Create Appointment"}/> */}
                    </Toolbar.FlexibleSpace>
                    
                    <DateNavigator />
                    <TodayButton />
                    <ViewSwitcher />
                    <Appointments />
                    {/* <Resources  /> */}

                    <EditingState />
                    <IntegratedEditing />
                    
                    <AppointmentTooltip
                        showCloseButton
                        headerComponent={this.CustomTooltip}
                        // studentCwid={this.state.studentCwid}
                        
                    />

                        
                        {/* // showDeleteButton 
                        // does nothing :(
                        // https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
                        // onDeleteButtonClick={this.commitDelete}
                    /> */}

                    {/* <AppointmentTooltip.CommandButtonProps 
                        id="callback"
                        onExecute={this.getSchedulerData}
                    /> */}

                    
                    {/* <AppointmentForm />  */}
                </Scheduler>
            </Container>
        );
    }
}

export default StudentAppointment;



