import React, { useEffect, useState } from 'react';
import { Button, Container, Col, Row, Form, Alert } from 'react-bootstrap';
import { Inject, ScheduleComponent, Day, Week, ViewsDirective, ViewDirective, EventSettingsModel } from '@syncfusion/ej2-react-schedule'
import { useCombobox } from 'downshift';
import "../App.css"
import { Input } from 'antd';
import { LINK } from '../API/constants';
import API from '../API';


class ClassSchedule extends React.Component {

}

const Schedule = () => {


    const [inputItems, setInputItems] = useState([])
    const [events, setEvents] = useState([])
    const [classes, setClasses] = useState([])
    const [singleUser, setSingleUser] = useState("")
    const [input, setInput] = useState("");

    // http://jsonplaceholder.typicode.com/users
    // LINK +"/api/getAllClasses/"

    useEffect(() => {
        fetch(LINK + "/api/getAllClasses/")
            .then((response) => response.json())
            .then((data) => setClasses(data))
    }, [])

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
    


    const addEvent = (item) => {

        //Parsing class information
        const startHour = (item.timeOfDay.substring(3, 8).includes("pm") && parseInt(item.timeOfDay.substring(0, item.timeOfDay.indexOf(':'))) !== 12
            ? parseInt(item.timeOfDay.substring(0, item.timeOfDay.indexOf(':'))) + 12 : item.timeOfDay.substring(0, item.timeOfDay.indexOf(':')))

        const startMin = (item.timeOfDay.substring(item.timeOfDay.indexOf(':') + 1, item.timeOfDay.indexOf('-') - 2) === "00"
            ? "0" : item.timeOfDay.substring(item.timeOfDay.indexOf(':') + 1, item.timeOfDay.indexOf('-') - 2))

        const endHour = (item.timeOfDay.substring(10, item.timeOfDay.length).includes("pm") && parseInt(item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':'))) !== 12
            ? parseInt(item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':'))) + 12 : item.timeOfDay.substring(item.timeOfDay.indexOf('-') + 1, item.timeOfDay.lastIndexOf(':')))

        const endMin = (item.timeOfDay.substring(item.timeOfDay.lastIndexOf(':') + 1, item.timeOfDay.length - 2) === "00"
            ? "0" : item.timeOfDay.substring(item.timeOfDay.lastIndexOf(':') + 1, item.timeOfDay.length - 2))

        const numOfDay = item.dayOfClass.length

        let notAdded = events.map(previousItem => item.crn.toString().includes(previousItem.crn)).every(v => v === false)

        console.log( "not added " + notAdded)
        //Adding each instance of the class to the schedule
        if (notAdded) {
            
            addClass(30086383, item.crn);

            for (let index = 0; index < numOfDay; index++) {


                const day = (item.dayOfClass.substring(index, index + 1))
                let date = '';

                if (day === "M") { date = 2 }
                else if (day === "T") { date = 3 }
                else if (day === "W") { date = 4 }
                else if (day === "R") { date = 5 }
                else if (day === "F") { date = 6 }



                const newEvent = {
                    Subject: item.subj + ' ' + item.course,
                    crn: item.crn,
                    StartTime: new Date(2020, 2, date, startHour, startMin),
                    EndTime: new Date(2020, 2, date, endHour, endMin),
                    Location: item.classRoom,
                    Day: day,
                }

                console.log("is working")

                setEvents(events => [...events, newEvent]); //need to stop duplicates

            }

        }


    }

    const dropEvent = 
    (crn) => {
        console.log("delete");
        setEvents( events.filter( a => a.crn !== crn));
        dropClass(30086383, crn);
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
            <br />{props.Location}<br />{props.Day} </div>

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
        <Container>
            <br />
            <Row>
                <Col className="searchCol" lg={4}>
                    <Form.Group controlId="userName">
                        <Form.Label>Search Classes: {singleUser}</Form.Label>

                        <div {...getComboboxProps()}>
                            <Input
                                {...getInputProps()}
                                // placeholder="Search: CSCI 4060,fr"
                                // enterButton="Search"
                                // size="small"
                            />
                        </div>
                        <ul {...getMenuProps()}>
                            {
                                //isOpen &&
                                inputItems.map((item, index) => (
                                    <span
                                        key={item.crn}
                                        {...getItemProps({ item, index })}
                                        onClick={() => { setSingleUser(item.subj + ' ' + item.course); addEvent(item) }}
                                    >
                                        <li
                                            style={highlightedIndex === index ? { background: "#ede" } : {}}
                                        >
                                            <h4>{item.subj} {item.course}</h4>
                                        </li>
                                    </span>
                                ))}
                        </ul>
                        {/* <Form.Control
                            type="class"
                            placeholder="Search: CSCI 4060,fr"
                        /> */}
                    </Form.Group>


                </Col>

                <Col className="scheduleCol" lg={8}>
                    <ScheduleComponent showHeaderBar={false}
                        height='550px' width='120%'
                        currentView='Week' selectedDate={new Date(2020, 2, 1)}
                        readonly="true"
                        eventSettings={{ dataSource: events, template: eventTemplate.bind(), enableTooltip: true, tooltipTemplate: template.bind() }}
                        popupOpen={onPopupOpen.bind()}
                    >
                        <ViewsDirective>
                            <ViewDirective option="Week"></ViewDirective>
                        </ViewsDirective>
                        <Inject services={[Week]} />
                    </ScheduleComponent>
                </Col>

            </Row>
        </Container>
    )
}

export default Schedule;