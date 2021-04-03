import axios from 'axios';

export function loginAction(credentials){
    return dispatch => {
        axios
        .post('http://localhost:5000/login',credentials)
        .then( r => {
            const {denied} = r.data;
            if(denied){
                dispatch({type:'INVALID_AUTHORIZATION',payload:denied})
            }
            else{
                localStorage.setItem('auth-token',r.data)
                dispatch({type:'VALID_AUTHORIZATION',payload:r.data})
            }
        })
        .catch( e => dispatch({type:'SHOW_ERROR',payload:e}));
    }
}

export function resetLoginAction(){
    return dispatch => dispatch({type:'RESET'})
}