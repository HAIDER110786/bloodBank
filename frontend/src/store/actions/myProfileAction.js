import axios from 'axios';
import moment from 'moment';

const customAxios = axios.create({headers:{Authorization:localStorage.getItem('auth-token')}})

export function myProfileBioRecordsCommentsRequestsMessages(){
    return dispatch => {
        
        //design a dispatch here where the loading for the entire screen is done 
        //altogether. Probably consider using suspence.

        //currently we are using loading for comments,records and the user
        dispatch({type:'LOADING_MY_DATA'});
        dispatch({type:'LOADING_MY_RECORDS'});  
        dispatch({type:'LOADING_MY_COMMENTS'});
        
        axios.all([
            customAxios.get('http://localhost:5000/myProfile'),
            customAxios.get('http://localhost:5000/records'),
            customAxios.get('http://localhost:5000/comments'),
            customAxios.get('http://localhost:5000/newRequest'),
            customAxios.get('http://localhost:5000/newComment'),
        ])
        .then( r => {
            const myData = r[0].data;
            const myRecords = r[1].data.recordsArray;
            const myComments = r[2].data;
            const {request} = r[3].data;
            const {msg} = r[4].data;

            //1.
            //make a dispatch making loading as false and set the payload as myData
            dispatch({type:'SHOW_MY_DATA',payload:myData});
            
            //2.
            /* make a dispatch making recordLoading as false and set the data as the
            myRecords and do the mapping thing in the component itself*/
            myRecords && dispatch({type:'SHOW_MY_RECORDS',payload:myRecords});

            //3.
            /* make a dispatch making commentLoading as false and data set the data as the res
            and do the mapping thing in the component itself  */
            dispatch({type:'SHOW_MY_COMMENTS',payload:myComments});

            //4.
            //if the request is true, make a dispatch showing the request notification alert  
            request && dispatch({type:'SHOW_BLOOD_REQUEST_ALERT'});

            //5.
            //if the msg is true, make a dispatch showing new message notification alert  
            msg && dispatch({type:'SHOW_NEW_COMMENT_ALERT'});
        })
        .catch( e => {
            //design a dispatch for showing an error on the entire screen.
            console.log(e.message);
        })
    }
}

export function appendNewComment(comment){
    return dispatch => {
        dispatch({type:'LOADING_MY_COMMENTS'});
        customAxios
        .post('http://localhost:5000/comments',{comment})
        .then(() =>{  
            customAxios
            .get('http://localhost:5000/comments')
            .then(r => dispatch({type:'SHOW_MY_COMMENTS',payload:r.data}))
        })
        .catch(e => console.error(e));
    }
}

export function changeDP(file){
    return dispatch => {
        axios
        .post('http://localhost:5000/profile/images',
        file,
        {
            header:{
                Authorization:localStorage.getItem('auth-token'),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then( _ => {
            dispatch({type:'LOADING_MY_DATA'});
            customAxios.get('http://localhost:5000/myProfile')
            .then(r=>dispatch({type:'SHOW_MY_DATA',payload:r.data}))
            .catch(e=>console.error(e));
        })
        .catch( e =>console.error(e))
    }
}

export function hideAlert(alertType){
    return dispatch => {
        alertType === 'HIDE_BLOOD_REQUEST_ALERT'
        ? (
            customAxios
            .post('http://localhost:5000/hideRequests')
            .then( _ =>  dispatch({type:'HIDE_BLOOD_REQUEST_ALERT'}))
            .catch( e => console.error(e) )
        )
        : (
            customAxios
            .post('http://localhost:5000/hideComments')
            .then( _ =>  dispatch({type:'HIDE_NEW_COMMENT_ALERT'}))
            .catch( e => console.error(e) )
        )
    }
}

export function toggleReload(type){
    return dispatch => {
        type === 0 
        ? dispatch({type:'DISABLE_RELOAD'}) 
        : dispatch({type:'ENABLE_RELOAD'}) 
    }
}

export function requestResponse(id,response,requester,requestee){
    return dispatch => {

        dispatch({type:'LOADING_REQ_LIST'});

        axios.all([
            customAxios.delete('http://localhost:5000/requests/'+id),
            customAxios.post('http://localhost:5000/records/'+response,
            {
                requester:requester,
                date:moment().format('LLLL'),
                requestee:requestee
            }),
            customAxios.get('http://localhost:5000/notifications')
            //the 4th axios request is moved down and in the future combine the 4th request and the request 
            //above (3rd request)
        ])
        .then(r=>{
            dispatch({type:'SHOW_REQ_LIST',payload:r[2].data});
            dispatch({type:'LOADING_MY_RECORDS'});
            customAxios.get('http://localhost:5000/records')
            .then(r=> r.data.recordsArray && dispatch({type:'SHOW_MY_RECORDS',payload:r.data.recordsArray}))
            .catch(e=>console.error(e))
        })
        .catch(e=>console.error(e));
    }
}

export function showRequests(){

    return dispatch => {
        dispatch({type:'LOADING_REQ_LIST'});

        axios.get('http://localhost:5000/notifications',{
            headers: {
                Authorization:localStorage.getItem('auth-token')
            }
        })
        .then(res => {
            //the dispatch below sents the data in a variable named requestListData in the redux store
            dispatch({type:'SHOW_REQ_LIST',payload:res.data});
        })
        .catch(err => {
            console.error(err)
        });
    }
}

export function showComments(){

    return dispatch => {
        dispatch({type:'LOADING_COMMENT_LIST'})

        axios.get('http://localhost:5000/comments',{
            headers: {Authorization:localStorage.getItem('auth-token')}
        })
        .then(r => {
            dispatch({type:'SHOW_COMMENT_LIST',payload:r.data})
        })
        .catch(err => {
            console.error(err)
        });
    }
}