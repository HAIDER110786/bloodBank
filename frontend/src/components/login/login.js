import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import {useHistory} from 'react-router-dom';

export default function Login(){   

    const history = useHistory();    

    const [credentials,setCredentials] = useState({
        number:'',
        password:'',
    });

    const [LoggedInButton,DisableLoggedInButton] = useState(false);

    useEffect(() => {
        if(history.location.data==="logged_in"){
            setTimeout(()=>{
                alert('registration successfull! Please re-enter your credentials to log in');
            },16);
        }
    }, [])

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }

    const HandleSubmit = (e) =>{
        e.preventDefault();
        DisableLoggedInButton(true);
        axios.post('http://localhost:5000/login',credentials)
        .then((res)=>{
            const {denied} = res.data;
            if(!denied){
                localStorage.setItem('auth-token',res.data);
                window.location = ('/dashboard');
            }
            else{
                alert(denied);
            }
            DisableLoggedInButton(false);
        }).catch((err)=>console.log(err));
    }

    if(localStorage.getItem('auth-token')){
        window.location = ('/dashboard');
    }

    function handleSignUp(e){
        e.preventDefault();
        history.push({pathname:'/signup'})
    }

    return(
        <div className="loginDiv">
            <form onSubmit={HandleSubmit}>
                <h1>BLOOD BANK LOGIN</h1>
                <input type="text" name="number" placeholder="Enter Your Phone Number" onChange={handleChange} required/>
                <input type="password" name="password" placeholder="Enter Your Password" onChange={handleChange} required/>
                <button disabled={LoggedInButton} type="submit">LOGIN</button>
                <p>Don't have an account ?<span onClick={handleSignUp}>Signup</span></p>
            </form>
        </div>
    )
}