import axios from 'axios';

export function signupAction(userDetails){
    return dispatch => {
        axios
        .post('http://localhost:5000/register',userDetails)
        .then( r => {
            const {approved,denied} = r.data;
            if(approved){
                dispatch({type:'VALID_REGISTRATION',payload:approved});
            }
            else if(denied){
                dispatch({type:'INVALID_REGISTRATION',payload:denied})
            }
        })
        .catch( e => dispatch({type:'SHOW_ERROR',payload:e}));
    }
}

export function resetSignupAction(){
    return dispatch => dispatch({type:'RESET'})
}