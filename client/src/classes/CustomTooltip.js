import React from 'react';
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
import { Button, Col, Container, Form, Nav, Navbar, Row } from 'react-bootstrap';
import db from '../API/ApptAPI'

// function CustomTooltip(props) {
//     //studentCwid = props
//     console.log(props);
//     // console.log(props.appointmentData.callback);
//     console.log(props.studentCwid);

//     // constructor(props) {
//     //     super(props);
//     //     this.callback = props.callback;
//     //     this.studentCwid = props.studentCwid;
//     // }

//     const unassignStudentFromAppointment = async (studentCwid, id) => {
//         console.log(studentCwid);
//         await db.unassignStudentFromAppointment(studentCwid, id).then(() => {
//             props.callback();
//             return;
//         });
        
//     }

//     const assignStudentToAppointment = async (studentCwid, id) => {
//         await db.assignStudentToAppointment(studentCwid, id).then(() => {
//             props.callback();
//             return;
//         });
//     }

//     const handleDelete = (deleted) => {
//         console.log(deleted)
//         if(deleted) {
//             unassignStudentFromAppointment(props.studentCwid, deleted.deleted);
//         }
//     }

//     const handleAssign = () => {
//         console.log("delete");
//     }
    
    
//     return (
//         <Row>
//             <Button variant="link" onClick={handleAssign}>Assign</Button>
//             <Button variant="link" onClick={handleDelete}>Unassign</Button>
            
//         </Row>
//     )
    
    
// }

class CustomTooltip extends React.Component {
    callback;
    studentCwid;

    constructor(...rest) {
        super(...rest);
        console.log(rest)
        
        this.studentCwid=rest[0];
        this.callback=rest[1];
        // this.callback = props.callback;
        // this.studentCwid = props.studentCwid;

        for (var key in rest) {
            console.log(rest[key]);
          }
    }

    unassignStudentFromAppointment = async (studentCwid, id) => {
        console.log(studentCwid);
        await db.unassignStudentFromAppointment(studentCwid, id).then(() => {
            this.callback();
            return;
        });
        
    }

    assignStudentToAppointment = async (studentCwid, id) => {
        await db.assignStudentToAppointment(studentCwid, id).then(() => {
            this.callback();
            return;
        });
    }

    handleDelete = (deleted) => {
        console.log(deleted)
        if(deleted) {
            this.unassignStudentFromAppointment(this.studentCwid, deleted.deleted);
        }
    }

    handleAssign = () => {
        console.log("delete");
    }
    
    render () {
        return (
            <Row>
                <Button variant="link" onClick={this.handleAssign}>Assign</Button>
                <Button variant="link" onClick={this.handleDelete}>Unassign</Button>
                
            </Row>
        )
    }
    
}

// class CustomTooltip extends React.Component {
//     callback;
//     studentCwid;

//     constructor(...rest) {
//         super(...rest);
//         console.log(rest)
        
//         this.studentCwid=rest[0];
//         this.callback=rest[1];
//         // this.callback = props.callback;
//         // this.studentCwid = props.studentCwid;

//         for (var key in rest) {
//             console.log(rest[key]);
//           }
//     }

//     unassignStudentFromAppointment = async (studentCwid, id) => {
//         console.log(studentCwid);
//         await db.unassignStudentFromAppointment(studentCwid, id).then(() => {
//             this.callback();
//             return;
//         });
        
//     }

//     assignStudentToAppointment = async (studentCwid, id) => {
//         await db.assignStudentToAppointment(studentCwid, id).then(() => {
//             this.callback();
//             return;
//         });
//     }

//     handleDelete = (deleted) => {
//         console.log(deleted)
//         if(deleted) {
//             this.unassignStudentFromAppointment(this.studentCwid, deleted.deleted);
//         }
//     }

//     handleAssign = () => {
//         console.log("delete");
//     }
    
//     render () {
//         return (
//             <Row>
//                 <Button variant="link" onClick={this.handleAssign}>Assign</Button>
//                 <Button variant="link" onClick={this.handleDelete}>Unassign</Button>
                
//             </Row>
//         )
//     }
    
// }

export default CustomTooltip;