import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, withRouter, Router, Redirect } from 'react-router-dom';
import Pages from './pages';
import Components from './components'
import './App.css';
//import API from './API';
import CookieService from './API/CookieService';
//import userEvent from '@testing-library/user-event';


var cookieUser = null;

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props); // getting props sent from other classes

    this.state = { // current state of the Component
      //verified: false, // removed since i think it should be tied to the user object directly
      //username: "",  removed for the same reason
      user: {
        username: "",
        email: "",
        acctType: "",
        id: "",
        verified: false
      },
      location: "Home"
    };
    this.getUser = this.getUser.bind(this);
    this.setLocation = this.setLocation.bind(this);

  }


  access = () => {

    /*
    // commenting out; 
    // seems like it just flip-flops verified now that cookies are enabled
    
    //changing value of verified if user logs in or out
    var newVer = !this.state.verified;
    this.setState({ verified: newVer }) // users logged in, changes if users logs out and vice versa
    console.log(this.state.verified)
      */



    // removing code below; testing if it's needed

    //var newVer = false;

    // user's logged in, changes if users logs out and vice versa
    // the only value changing is verified; everything else is copied
    /*
    this.setState({user: {verified: newVer, 
      username: this.state.user.username, 
      email: this.state.user.email, 
      id: this.state.user.id, 
      acctType: this.state.user.acctType
    }}) 
    */
    //console.log("verified: " + CookieService.get("user-cookie").verified);
  }

  componentDidUpdate() {
    cookieUser = CookieService.get("user-cookie");
    console.log("cookie did update");
  }


  getUser(tempUser: any) {

    if (tempUser) {
      this.setState({ user: { username: tempUser.username, email: tempUser.email, id: tempUser.id, acctType: tempUser.acctType, verified: tempUser.verified } });
      console.log("acctType: " + this.state.user.acctType);
    } else {
      console.log("tempUser is undefined");
    }
  }

  setLocation(loc: string) {
    this.setState({ location: loc });
    console.log("loc: " + loc);
  }

  render() {
    return (
      <>
        {
          // <Pages.AdvisorAppointment advisorCwid={1} studentCwid={1000} />
          !(cookieUser = CookieService.get("user-cookie")) ?
            <Switch> <Route path="/"><Pages.Login access={() => this.access()} getUser={this.getUser} /></Route></Switch>
            :
            <>
              <Components.NavBar location={this.state.location} />
              {cookieUser.acctType == 'student' || cookieUser.acctType == 'Student' &&
                < Switch >

                  <Route path='/viewschedule'>< Pages.Schedule id={cookieUser.id} /></Route>
                  <Redirect from='/viewschedule' to='/viewschedule' />
                  <Route path='/studentappt'>< Pages.StudentAppointment studentCwid={cookieUser.id} /></Route>
                  <Redirect from='/studentappt' to='/studentappt' />
                  <Route path='/availableclasses'><Pages.AvailableClasses /></Route>
                  <Redirect from='/availableclasses' to='availableclasses' />
                  
                  <Route path='/agreement'>< Pages.Agreement /></Route>
                  <Redirect from='/agreement' to='/agreement' />
                  
                  <Route path='/'>< Pages.StudentHome setLocation={this.setLocation} /></Route>
                  
                </Switch>
              }
              {cookieUser.acctType == 'advisor' || cookieUser.acctType == 'Advisor' &&
                <Switch>
                  <Route path='/advisorappt'>< Pages.AdvisorAppointment advisorCwid={cookieUser.id} /></Route>
                  <Redirect from='/advisorappt' to='/advisorappt' />
                  <Route path='/availableclasses'><Pages.AvailableClasses /></Route>
                  <Redirect from='/availableclasses' to='availableclasses' />

                  <Route path='/agreement'>< Pages.Agreement /></Route>
                  <Redirect from='/agreement' to='/agreement' />

                  <Route path='/'><Pages.AdvisorHome setLocation={this.setLocation} /></Route>
                  <Redirect from='/' to='/' />
                </Switch>
              }
              { cookieUser.acctType == 'graduate' || cookieUser.acctType == 'Graduate' &&
                <Switch>
                  <Route path='/viewschedule'>< Pages.Schedule id={this.state.user.id} /></Route>
                  <Redirect from='/viewschedule' to='/viewschedule' />
                  <Route path='/studentappt'>< Pages.StudentAppointment /></Route>
                  <Redirect from='/studentappt' to='/studentappt' />
                  <Route path='/studenthome'>< Pages.StudentHome /></Route>
                  <Redirect from='/studenthome' to='/studenthome' />
                  <Route path='/advisorappt'>< Pages.AdvisorAppointment /></Route>
                  <Redirect from='/advisorappt' to='/advisorappt' />
                  <Route path='/advisorhome'><Pages.AdvisorHome /></Route>
                  <Redirect from='/advisorhome' to='/advisorhome' />

                  <Route path='/agreement'>< Pages.Agreement /></Route>
                  <Redirect from='/agreement' to='/agreement' />

                  <Route path='/'><Pages.GraduateHome /></Route>
                  <Redirect from='/' to='/' />
                </Switch>

              }
            </>
        }
      </>
    );

  }
}

// interface for props to be received, will stay empty but we have to have it for React/TS to work
export interface IAppProps { }

// interface for the state
export interface IAppState {

  //verified: any, //only verified (for now), will probably need others (i.e. user object - we'll need ID and such)
  //username: string, //removed since user.username exists
  user: {
    username: string,
    email: string,
    acctType: string,
    id: string,
    verified: boolean
  }, location: string
}

export default App;
