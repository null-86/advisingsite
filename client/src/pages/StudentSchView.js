import React, { useEffect, useState } from 'react';
import { Button, Container, Col, Row, Form, Alert, Modal } from 'react-bootstrap';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, ViewsDirective, ViewDirective, EventSettingsModel } from '@syncfusion/ej2-react-schedule'
import { useCombobox } from 'downshift';
import CookieService from '../API/CookieService';
import App from "../App";
import "./ClassSchedule.css"
import { Input } from 'antd';
import { LINK } from '../API/constants';
import API from '../API';



const StudentSchView = (props) => {

    const [inputItems, setInputItems] = useState([])
    const [checked, setChecked] = useState("")
    const [studentAgree, setStudentAgree] = useState('');
    const [events, setEvents] = useState([])
    const [classes, setClasses] = useState([])
    const [singleUser, setSingleUser] = useState("")
    const [show, setShow] = useState(false);
    const [disableSchedule, setDisableSchedule] = useState("");

    useEffect(() => {

        fetch(LINK + "/api/getAllClasses/")
            .then((response) => response.json())
            .then((data) => setClasses(data))



    }, [])

    useEffect(() => {

        let res = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: props.studentCwid, acctType: CookieService.get("user-cookie").acctType }) //creating JSON object
        }



        fetch(LINK + '/api/getAgreement/', res)
            .then((response) => response.json())
            .then((data) => {
                console.log("is it working")
                if (data.advisorAgree == "1")
                    setChecked("checked");
                if (data.studentAgree == "1")
                setStudentAgree("checked");
            })

            
    }, [])

    useEffect(() => {
        console.log(studentAgree + "+"  + checked)
        if (studentAgree == "checked" && checked == "checked") {
            setDisableSchedule("SCHEDULE CAN NO LONGER BE MODIFIED")
        }
    }, [studentAgree, checked])
    

    const handleShow = () => {
        if (studentAgree != "checked" || checked != "checked") {
            setShow(true)
        }
    }

    const handleClose = () => setShow(false);
    const handleChange = () => {

        setChecked("checked")

        let response = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: props.studentCwid, acctType: CookieService.get("user-cookie").acctType }) //creating JSON object
        }

        fetch(LINK + '/api/changeAgreement/', response) // async, wait for server response

        console.log(checked)
    }

    useEffect(() => {

        let res = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: props.studentCwid }) //creating JSON object
        }

        fetch(LINK + '/api/scheduleInfo', res)
            .then((response) => response.json())
            .then((data) => {

                if (classes.length != 0) {
                    console.log(data)
                    const addedClass = []
                    for (let index = 0; index < data.length; index++) {

                        const currentClass = classes.filter(item => item.crn == data[index])[0]


                        if (!addedClass.includes(currentClass)) {
                            console.log(addedClass)
                            addEvent(currentClass, false)
                            addedClass.push(currentClass)

                        }
                    }
                }
            }
            )



    }, [classes])




    const addClass = (studentId, classCrn) => {
        let response = {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: studentId, crn: classCrn }) //creating JSON object
        }

        fetch(LINK + '/api/addClass/', response) // async, wait for server response
        console.log("addClass: " + studentId + " " + classCrn)
    }

    const dropClass = (studentId, classCrn) => {
        let response = {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: studentId, crn: classCrn }) //creating JSON object
        }

        fetch(LINK + '/api/removeClass/', response) // async, wait for server response
        console.log("drop: " + studentId + " " + classCrn)

    }



    const addEvent = (item, flag) => {

        //Parsing class information
        const startHour = (item.timeOfDay.substring(3, 8).includes("PM") && parseInt(item.timeOfDay.substring(0, item.timeOfDay.indexOf(':'))) !== 12
            ? parseInt(item.timeOfDay.substring(0, item.timeOfDay.indexOf(':'))) + 12 : item.timeOfDay.substring(0, item.timeOfDay.indexOf(':')))

        const startMin = (item.timeOfDay.substring(item.timeOfDay.indexOf(':') + 1, item.timeOfDay.indexOf('-') - 2) === "00"
            ? "0" : item.timeOfDay.substring(item.timeOfDay.indexOf(':') + 1, item.timeOfDay.indexOf('-') - 2))

        const endHour = (item.timeOfDay.substring(10, item.timeOfDay.length).includes("PM") && parseInt(item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':'))) !== 12
            ? parseInt(item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':'))) + 12 : item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':')))

        const endMin = (item.timeOfDay.substring(item.timeOfDay.lastIndexOf(':') + 1, item.timeOfDay.length - 2) === "00"
            ? "0" : item.timeOfDay.substring(item.timeOfDay.lastIndexOf(':') + 1, item.timeOfDay.length - 2))

        const numOfDay = item.dayOfClass.length

        let notAdded = events.map(previousItem => item.crn.toString().includes(previousItem.crn)).every(v => v === false)


        if (notAdded && (studentAgree != "checked" || checked != "checked")) {
            console.log(`Advisor's id: ` + CookieService.get("user-cookie").id)
            console.log(`Student's id: ` + props.studentCwid)
            if (flag == true) {
                addClass(props.studentCwid, item.crn);
            }

            for (let index = 0; index < numOfDay; index++) {


                const day = (item.dayOfClass.substring(index, index + 1))
                let date = '';

                if (day === "M") { date = 1 }
                else if (day === "T") { date = 2 }
                else if (day === "W") { date = 3 }
                else if (day === "R") { date = 4 }
                else if (day === "F") { date = 5 }



                const newEvent = {
                    Subject: item.subj + ' ' + item.course,
                    crn: item.crn,
                    StartTime: new Date(2020, 5, date, startHour, startMin),
                    EndTime: new Date(2020, 5, date, endHour, endMin),
                    Location: item.classRoom,
                    Day: day,
                }

                setEvents(events => [...events, newEvent]); //need to stop duplicates

            }

        }


    }

    const dropEvent = (crn) => {
        if (studentAgree != "checked" || checked != "checked") {
            console.log("delete");
            setEvents(events.filter(a => a.crn !== crn));
            dropClass(props.studentCwid, crn);
        }
    }

    const template = (props) => {
        return (<div className="tooltip-wrap">
            <div className="content-area"><div className="name">{props.Subject}</div>
                {(props.City !== null && props.City !== undefined) ? <div className="city">{props.City}</div> : ''}
                <div className="time">From: {props.StartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="time">To: {props.EndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <div className="time">Location: {props.Location}</div></div></div></div>);
    }



    const eventTemplate = (props) => {
        return (<>
            <div className="template-wrap">{props.Subject}
                <span className="event-Delete" onClick={() => dropEvent(props.crn)} > <span style={{ fontSize: "11px", fontWeight: "500" }} > X</span> </span>
                <br />{props.crn}<br />{props.Location}<br /> </div>

        </>
        );
    }

    const onPopupOpen = (args) => {
        args.cancel = true;
    }

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: inputItems,
        onInputValueChange: ({ inputValue }) => {
            setInputItems(
                classes.filter((item) => 
                    item.subj.toLowerCase().startsWith(inputValue.toLowerCase())
                )
            )
        },
    })


    return (
      
        <Container fluid={true} style={{ paddingLeft: 40, paddingRight: 0 }}>
            <br />
            <Row >
                <Col className="searchCol"  lg={{ size: "auto", span: "auto" }} md={{ size: "auto", span: "auto", order: 1 }}>
                    <Form.Group controlId="userName">
                        <Form.Label >Search Classes: {singleUser}</Form.Label>

                        <div {...getComboboxProps()}>
                            <Input
                                {...getInputProps()}
                            />
                        </div>
                        <br />
                        <ul {...getMenuProps({ style: { height: 400, overflowY: "auto" } })} className="downshift-dropdown">

                            {
                                inputItems.map((item, index) => (
                                    <div
                                        key={item.crn}
                                        {...getItemProps({ item, index })}
                                        onClick={() => { setSingleUser(item.subj + ' ' + item.course); addEvent(item, true) }}

                                    >
                                        <li className="dropDown"
                                            style={highlightedIndex === index ? { background: "#ede" } : {}}
                                        >
                                            <div style={{ fontSize: 18, fontWeight: 500 }}>
                                                {item.subj} {item.course} &nbsp;
                                                <span style={{ color: "#d6d6d6" }}>{item.crn}</span>

                                                <div className="innerDrop" style={{ fontSize: 13, fontWeight: 450 }}>{item.title}</div>
                                                <div className="innerDrop" style={{ fontSize: 12, fontWeight: 450 }}>{item.instructor} </div>
                                                <p className="innerDrop" style={{ fontSize: 10, fontWeight: 450 }}>{item.timeOfDay} &nbsp;&nbsp;
                                                {item.creditHrsMin} credits &nbsp;&nbsp; {item.Enrolled} / {item.Max} </p>
                                            </div>


                                        </li>
                                        <p></p>

                                    </div>
                                ))}


                        </ul>
                        <Form>
                            {['checkbox'].map((type) => (
                                <div className="confirmation">
                                    <Form.Check
                                        type={type}
                                        onChange={() => {
                                            handleShow()

                                        }}
                                        defaultChecked={
                                            checked
                                        }
                                        checked={checked}
                                        id={`advisor`}
                                        label={`I agree to schedule (Advisor)`}
                                    />

                                    <Form.Check
                                        disabled
                                        defaultChecked={
                                            studentAgree
                                        }
                                        checked={studentAgree}
                                        type={type}
                                        label={`I agree to schedule (Student)`}
                                        id={`student`}
                                    />
                                </div>
                            ))}
                        </Form>
                    </Form.Group>


                </Col>



                <Col className="scheduleCol" lg={{ size: 8, span: 8, order: 2 }} md={{ size: 10, span: 7, order: 2 }}>
                    <div className = "disableSch">
                        {disableSchedule} 
                    </div>
                    <ScheduleComponent showHeaderBar={false}
                        height='590px' width='120%'
                        currentView='WorkWeek' selectedDate={new Date(2020, 5, 1)}
                        readonly="true"
                        eventSettings={{ dataSource: events, template: eventTemplate.bind(), enableTooltip: true, tooltipTemplate: template.bind() }}
                        popupOpen={onPopupOpen.bind()}
                    >
                        <ViewsDirective>
                            <ViewDirective option="WorkWeek"></ViewDirective>
                        </ViewsDirective>
                        <Inject services={[Week, WorkWeek]} />
                    </ScheduleComponent>
                </Col>



                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>WARNING</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Agreement to schedule CANNOT be changed. <br /> Please be sure you have been advised before you agree</Modal.Body>
                    <Modal.Footer>
                        {/* <Button variant="secondary" onClick={handleClose}>
                            Close
          </Button> */}
                        <Button variant="primary" onClick={() => {
                            handleChange()
                            handleClose()
                        }}>
                            I Agree
          </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </Container>


    )
}

export default StudentSchView; 