import React from 'react';
import Signup from './components/signup/signup.js';
import Login from './components/login/login.js';
import Dashboard from './components/dashboard/dashboard.js';
import Profile from './components/profile/profile.js';
import MyProfile from './components/myProfile/myProfile.js';
import {BrowserRouter as Router, Route} from 'react-router-dom'; 

function App() {
  return (
    <Router>
        <Route exact path="/" component={Login}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/dashboard" component={Dashboard}/>
        <Route exact path="/profile/:id" component={Profile}/>
        <Route exact path="/myProfile" component={MyProfile}/>
    </Router>
  );
}

export default App;
