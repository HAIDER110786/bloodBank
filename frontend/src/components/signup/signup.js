import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import {useHistory} from 'react-router-dom';

export default function Signup(){

    const [userDetails,setUserDetails] = useState({
        name:'',
        age:'',
        number:'',
        password:'',
        city:'',
        blood_group:'',
        requirements:'',
    });

    const [RegisterButton,DisableRegisterButton] = useState(false);
    
    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name] : e.target.value
        })
    }
    
    const history = useHistory();
    
    const HandleSubmit = (e) =>{
        e.preventDefault();
        DisableRegisterButton(true);
        axios
        .post('http://localhost:5000/register',userDetails)
        .then((res)=>{
            if(res.data.approved){
                history.push({
                    pathname:'/',
                    data:"logged_in"
                });
            }
            else if(res.data.denied){
                alert(res.data.denied);
            }
            DisableRegisterButton(false);
        })
        .catch((err)=>console.log(err));
    }

    if(localStorage.getItem('auth-token')){
        window.location = ('/dashboard');
    }

    return(
        <div className="signupDiv">
            <div onClick={()=>history.goBack()} className="backArrow">&#x2190;</div>
            <form onSubmit={HandleSubmit}>
                <h1>BLOOD BANK SIGNUP</h1> 
                <input type="text" name="name" placeholder="Enter Your Name" onChange={handleChange}  required/>
                <input type="text" name="age" placeholder="Enter Your Age" onChange={handleChange}  required/>
                <input type="text" name="number" placeholder="Enter Your Phone Number" onChange={handleChange}  required/>
                <input type="password" name="password" placeholder="Enter Your Password" onChange={handleChange}  required/>
                <input type="text" name="city" placeholder="Enter Your City"  onChange={handleChange}  required/>
                <select defaultValue={'Default'} name="blood_group" onChange={handleChange} required>
                    <option value="Default" disabled>Enter Your Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                </select>                
                <select defaultValue={'Default'} name="requirements" onChange={handleChange} required>
                    <option value="Default" disabled>Enter Your Requirements</option>
                    <option value="Donor">Donor</option>
                    <option value="Receiver">Receiver</option>
                    <option value="Both">Both</option>
                </select>
                <button disabled={RegisterButton} type="submit">Register</button>
            </form>
        </div>
    )
}