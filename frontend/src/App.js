import React from 'react';
import Signup from './components/signup/signup.js';
import Login from './components/login/login.js';
import Dashboard from './components/dashboard/dashboard.js';
import Profile from './components/profile/profile.js';
import MyProfile from './components/myProfile/myProfile.js';
import {BrowserRouter, Route} from 'react-router-dom'; 

function App() {
  return (
    <BrowserRouter>
        <Route exact path="/" component={Login}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/myProfile" component={MyProfile}/>
    </BrowserRouter>
  );
}

export default App;
