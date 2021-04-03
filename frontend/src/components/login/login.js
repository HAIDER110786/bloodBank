import React, { useState, useEffect } from 'react';
import {useHistory,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginAction,resetLoginAction} from '../../store/actions';
import './login.css';

function Login(props){

    const {
        loginAction,
        resetLoginAction,
        denied,
        error,
        isAuthenticated
    } = props;

    const [LoginButton,DisableLoginButton] = useState(false);
    
    const history = useHistory();
    
    const [credentials,setCredentials] = useState({
        number:'',
        password:'',
    });

    useEffect(() => {
        if(history.location.data==="logged_in"){
            setTimeout(()=>{
                alert('registration successfull!');
            },16);
        }
    }, [history.location.data])

    useEffect(() => {
        resetLoginAction();
        DisableLoginButton(false);
    },[
        denied,
        error,
        isAuthenticated,
        resetLoginAction
    ])
    
    if(denied){
        alert(denied);
    }

    if(error){
        alert(error);
    }

    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }

    const handleChange = e => {
        setCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }

    const HandleSubmit = (e) =>{
        e.preventDefault();
        loginAction(credentials);
    }
    
    function handleSignUp(e){
        e.preventDefault();
        history.push('/signup')
    }

    if(localStorage.getItem('auth-token')){
        return <Redirect to='/dashboard'/>
    }
    
    return(
        <div className="loginDiv">
            <form 
                onSubmit={HandleSubmit}
            >
                <h1>BLOOD BANK LOGIN</h1>
                <input 
                    type="text" 
                    name="number" 
                    placeholder="Enter Your Phone Number" 
                    onChange={handleChange} 
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter Your Password" 
                    onChange={handleChange} 
                    required
                />
                <button 
                    disabled={LoginButton} 
                    type="submit"
                >
                    LOGIN
                </button>
                <p> Don't have an account ?
                    <span onClick={handleSignUp}>
                        Signup
                    </span>
                </p>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    error: state.loginReducer.error,
    denied: state.loginReducer.denied,
    status: state.loginReducer.status, 
})

const mapDispatchToProps = {
    loginAction,
    resetLoginAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)