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


// class ClassSchedule extends React.Component {

// }

const Schedule = (props) => {

    const [inputItems, setInputItems] = useState([])
    const [checked, setChecked] = useState("")
    const [advAgree, setAdvAgree] = useState("");
    const [events, setEvents] = useState([])
    const [classes, setClasses] = useState([])
    const [singleUser, setSingleUser] = useState("")
    const [show, setShow] = useState(false);
    const [disableSchedule, setDisableSchedule] = useState("");
    const [testing, setTesting] = useState("DELETE NOW")


    useEffect(() => {

        fetch(LINK + "/api/getAllClasses/")
            .then((response) => response.json())
            .then((data) => setClasses(data))



    }, [])
    
    useEffect(() => {

        dropEvent(testing);
    }, [testing])

    useEffect(() => {
        let res = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: CookieService.get("user-cookie").id, acctType: CookieService.get("user-cookie").acctType }) //creating JSON object
        }

        fetch(LINK + '/api/getAgreement/', res)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.studentAgree == "1")
                    setChecked("checked");
                if (data.advisorAgree == '1')
                    setAdvAgree('checked');
            })
    }, [])

    useEffect(() => {
        if (advAgree == "checked" && checked == "checked") {
            setDisableSchedule("SCHEDULE CAN NO LONGER BE MODIFIED")
        }
    }, [advAgree, checked])

    const handleShow = () => {
        if (checked != "checked" || advAgree != "checked") {
            setShow(true)
        }
    }

    const handleClose = () => setShow(false);
    const handleChange = () => {

        setChecked("checked")

        let response = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: CookieService.get("user-cookie").id, acctType: CookieService.get("user-cookie").acctType }) //creating JSON object
        }

        fetch(LINK + '/api/changeAgreement/', response) // async, wait for server response

        console.log(checked)
    }

    useEffect(() => {

        let res = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: CookieService.get("user-cookie").id }) //creating JSON object
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

                        // addEvent(currentClass)

                        // console.log(classes.find(element => element(data[index])))
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
        // let r = await results.json();
        //console.log("loginAPI createNew(): " + r)

    }

    const dropClass = (studentId, classCrn) => {
        let response = {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cwid: studentId, crn: classCrn }) //creating JSON object
        }

        fetch(LINK + '/api/removeClass/', response) // async, wait for server response
        console.log("drop: " + studentId + " " + classCrn)
        // let r = await results.json();
        //console.log("loginAPI createNew(): " + r)
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


        // console.log("not added " + notAdded)
        //Adding each instance of the class to the schedule
        if (notAdded  && (advAgree != "checked" || checked != "checked")) {
            console.log(CookieService.get("user-cookie").id + " <_ this is my id")

            if (flag == true) {
                addClass(CookieService.get("user-cookie").id, item.crn);
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

        if (checked != "checked" || advAgree != "checked") {
            console.log("delete");
            setEvents(events.filter(a => a.crn !== crn));
            dropClass(CookieService.get("user-cookie").id, crn);
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
                <span className="event-Delete" onClick={() => { setTesting(props.crn)} } > <span style={{ fontSize: "11px", fontWeight: "500" }} > X</span> </span>
                <br />{props.crn}<br />{props.Location}<br /> </div>

        </>
        );
    }

    const onPopupOpen = (args) => {
        // if (args.type === 'EditorEventInfo') {
        args.cancel = true;
        // }
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
                             placeholder="Search: CSCI, Math, ..."
                            // enterButton="Search"
                            // size="small"
                            />
                        </div>
                        <br />
                        <ul {...getMenuProps({ style: { height: 400, overflowY: "auto" } })} className="downshift-dropdown">

                            {
                                //isOpen &&
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
                        {/* <Form.Control
                            type="class"
                            placeholder="Search: CSCI 4060,fr"
                        /> */}

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
                                        id={`student`}
                                        label={`I agree to schedule (Student)`}
                                    />
                                    <Form.Check
                                        disabled
                                        defaultChecked={
                                            advAgree
                                        }
                                        checked={advAgree}
                                        type={type}
                                        label={`I agree to schedule (Advisor)`}
                                        id={`advisor`}
                                    />
                                </div>
                            ))}
                        </Form>

                        
                    </Form.Group>


                </Col>


                

                <Col className="scheduleCol" lg={{ size: 8, span: 8, order: 2 }} md={{ size: 10, span: 7, order: 2 }}>
                    <div className="disableSch">
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
                {/* <form action="/action_page.php">
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                            <label for="vehicle1"> I have a bike</label><br>
                                <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
                                    <label for="vehicle2"> I have a car</label><br>
                                    </form> */}


            </Row>
        </Container>
    )
}

export default Schedule; 