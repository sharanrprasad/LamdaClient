import React, { Component } from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import {history} from './helpers';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import LandingScreen from './LandingScreen';

class App extends Component {

  isLoggedIn : boolean

  constructor(props){
    super(props);
  }



  render() {
    return (
        <div>
        <Router history = {history}>
          <Switch >
            <Route  exact = {true} path="/getall" component={HomeScreen} />
            <Route  exact = {true} path="/" component={LandingScreen} />
            <Route  exact = {true} path="/login" component={LoginScreen} />
          </Switch>
        </Router>
        </div>
    );
  }
}

export default App;
