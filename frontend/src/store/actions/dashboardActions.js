import axios from 'axios';

export function dashboardAction(){
    return dispatch => {
        dispatch({type:'LOADING'});
        axios
        .get('http://localhost:5000/dashboard',
            {
                headers:{
                    Authorization:localStorage.getItem('auth-token')
                }
            }
        )
        .then(r => dispatch({type:'SHOW_USERS',payload:{users:r.data}}))
        .catch(e => dispatch({type:'RENDER_ERROR',payload:e})); 
    }
}