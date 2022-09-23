//these are the packages
// npm install @material-ui/core
// npm install @material-ui/icons
// npm i --save @devexpress/dx-react-core @devexpress/dx-react-scheduler
// npm i --save @devexpress/dx-react-scheduler-material-ui
//Module documentation: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/getting-started/ 

/*

import  { Switch, Route, BrowserRouter, withRouter, Router } from 'react-router-dom';
import React , {Component, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DayView,
  currentViewName,
} from '@devexpress/dx-react-scheduler-material-ui';

import { Container } from 'react-bootstrap';
import { LINK, SERVER_ROOT } from '../API/constants';

const _schedulerData = [
      { startDate: '2020-11-01T09:45', endDate: '2020-11-01T11:00', title: 'Meeting' },
      { startDate: '2020-11-01T12:00', endDate: '2020-11-01T13:30', title: 'Go to a gym' },
];

const AppointmentCal = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  
  const handleSchedule = (e) => {
    setSchedulerData(e);
    console.log("handle " + e);
  }


   useEffect(() => {
    // fetch(LINK + '/api/getAptData').then((response) => response.json())
    // .then((data) => setSchedulerData(data))
  }, []); 

  return (
    <Container onLoad={(_schedulerData) => handleSchedule(_schedulerData)}>
         <Scheduler 
          data={_schedulerData}
          height={650}
        >
          <ViewState
            defaultCurrentDate={new Date(2020, 10, 25)}
            defaultCurrentViewName={'month'}
            // currentViewName={currentViewName}
            // onCurrentViewNameChange={this.currentViewNameChange}
          />

          <WeekView
            startDayHour={10}
            endDayHour={19}
          />
          <WeekView
            name="work-week"
            displayName="Work Week"
            excludedDays={[0, 6]}
            startDayHour={9}
            endDayHour={19}
          />
          <MonthView 
            name="month"
          />
          
          <DayView />

          <Toolbar />
          <ViewSwitcher />
          <Appointments />
        </Scheduler>
      </Container>

  )
};

export default AppointmentCal;





















// import { appointments } from '../../../demo-data/month-appointments';

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     const schedulerData = [
//       { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
//       { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
//     ];
//     this.state = {
//       data: schedulerData,
//       currentViewName: 'work-week',
//     };
//     this.currentViewNameChange = (currentViewName) => {
//       this.setState({ currentViewName });
//     };
//   }

//   render() {
//     const { data, currentViewName } = this.state;

//     return (
//       <Paper>
//         <Scheduler
//           data={data}
//           height={660}
//         >
//           <ViewState
//             defaultCurrentDate="2018-07-25"
//             currentViewName={currentViewName}
//             onCurrentViewNameChange={this.currentViewNameChange}
//           />

//           <WeekView
//             startDayHour={10}
//             endDayHour={19}
//           />
//           <WeekView
//             name="work-week"
//             displayName="Work Week"
//             excludedDays={[0, 6]}
//             startDayHour={9}
//             endDayHour={19}
//           />
//           <MonthView />
//           <DayView />

//           <Toolbar />
//           <ViewSwitcher />
//           <Appointments />
//         </Scheduler>
//       </Paper>
//     );
//   }
// }

*/