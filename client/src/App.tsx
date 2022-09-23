import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, withRouter, Router } from 'react-router-dom';
import Pages from './pages';
import './App.css';

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props); // getting props sent from other classes

    this.state = { // current state of the Component
      verified: true
    };
  }



  access = () => {
    //changing value of verified if user logs in or out
    var newVer = !this.state.verified;
    this.setState({ verified: newVer }) // users logged in, changes if users logs out and vice versa
  }



  render() {
    return (
      <>
        <Switch>
          <Route exact path="/"> {/* if the user is not verified, send them to login page*/}
            {this.state.verified ? <Pages.Schedule /> : <><Pages.Login access={() => this.access()} /></>}
            <Route path={"schedule"} component={Pages.Schedule} />
          </Route>

        </Switch>

      </ >
    );
  }
}

// interface for props to be received, will stay empty but we have to have it for React/TS to work
export interface IAppProps { }

// interface for the state
export interface IAppState {

  verified: any //only verified (for now), will probably need others (i.e. user object - we'll need ID and such)
}

export default App;
