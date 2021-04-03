import React, { useState , useEffect } from 'react';
import {useHistory,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {signupAction,resetSignupAction} from '../../store/actions';
import './signup.css';

function Signup(props){

    const history = useHistory();
    
    const {
        signupAction,
        resetSignupAction,
        approved,
        denied,
        error,
    } = props;

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

    useEffect(() => {
        resetSignupAction();
        DisableRegisterButton(false);
    }, [denied,error,resetSignupAction])

    if(denied) {
        alert(denied);
    }

    if(error) {
        alert(error);
    }

    if(approved){
        return <Redirect to={{
            pathname: '/',
            data: "logged_in"
        }} />
    }
    
    
    const HandleSubmit = (e) =>{
        e.preventDefault();
        DisableRegisterButton(true);
        signupAction(userDetails)
    }

    if(localStorage.getItem('auth-token')){
        return <Redirect to='/dashboard' /> ;
    }

    return(
        <div className="signupDiv">
            <div onClick={() => history.goBack()} className="backArrow">&#x2190;</div>
            <form onSubmit={HandleSubmit}>
                <h1>BLOOD BANK SIGNUP</h1>
                <input type="text" name="name" placeholder="Enter Your Name" onChange={handleChange} required />
                <input type="text" name="age" placeholder="Enter Your Age" onChange={handleChange} required />
                <input type="text" name="number" placeholder="Enter Your Phone Number" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Enter Your Password" onChange={handleChange} required />
                <input type="text" name="city" placeholder="Enter Your City" onChange={handleChange} required />
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


const mapStateToProps = state => ({
    approved: state.signupReducer.approved,
    error: state.signupReducer.error,
    denied: state.signupReducer.denied,
})

const mapDispatchToProps = {
    signupAction,
    resetSignupAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)