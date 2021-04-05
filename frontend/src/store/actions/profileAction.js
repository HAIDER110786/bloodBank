import axios from 'axios';

export function profileBioRecordsCommentsRequests(id){

    const customAxios = axios.create({
        headers:{
            Authorization:localStorage.getItem('auth-token')
        }
    })

    return dispatch => {

        //design a dispatch here where the loading for the entire screen is done 
        //altogether. Probably consider using suspence.

        //currently we are using loading for comments,records and the user
        dispatch({type:'LOADING_USERS'});
        dispatch({type:'LOADING_RECORDS'});  
        dispatch({type:'LOADING_COMMENTS'});
        
        axios.all([
            customAxios.get('http://localhost:8000/user/'+id),
            customAxios.get('http://localhost:8000/records/'+id),
            customAxios.get('http://localhost:8000/comments/'+id),
            customAxios.get('http://localhost:8000/mutualRequests/'+id)
        ])
        .then( r => {
            const userData = r[0].data;
            const userRecords = r[1].data.recordsArray;
            const profileComments = r[2].data;
            const requested = r[3].data.requested;

            //dispatch the action for showing user info
            dispatch({type:'SHOW_USERS',payload : {userData}});

            //dispatch the action for showing the records
            if(userRecords){
                if(userRecords.length > 0){
                    dispatch({type:'SHOW_RECORDS',payload : {userRecords}});
                }
            }

            //dispatch the action for showing the comments
            dispatch({type:'SHOW_COMMENTS',payload:{profileComments}})

            //dispatch the action for requested or not requested
            dispatch({type:'PROFILE_CHECKING_BLOOD_REQUEST',payload:{requested}})
        })
        .catch( e => {
            //design a dispatch for showing an error on the entire screen.
            console.log(e.message);
        })
    }
}

export function profileMakeBloodRequest(userData){

    return dispatch => {
        axios
        .post('http://localhost:8000/requests',{
            from:userData,
        },{
            headers:{
                Authorization:localStorage.getItem('auth-token')
            }
        })
        .then(() =>{
            dispatch({type:'MAKE_BLOOD_REQUEST'})
        })
        .catch(e =>{
            dispatch({type:'BLOOD_REQUESTING_ERROR',payload:e})
        });
    }
}

export function profileUpdateCommentsCommentRecordsAndFetchNewComments(id,newComment){

    const customAxios = axios.create({
        headers:{'Authorization':localStorage.getItem('auth-token')}
    });

    return dispatch => {
        axios.all([
            customAxios.post('http://localhost:8000/comments/'+id,{newComment}),
            customAxios.post('http://localhost:8000/commentRecords/'+id)
        ])
        .then(()=>{
            dispatch({type:'LOADING_COMMENTS'});
            customAxios.get('http://localhost:8000/comments/'+id)
            .then(r => dispatch({type:'SHOW_COMMENTS',payload:{profileComments:r.data}}))
            .catch(e => dispatch({type:'SHOW_PROFILE_COMMENTS_ERROR',payload:e}))
        })
        .catch((e)=>{
            console.log({error:e.message});
            //dispatch an action to show the error impling the fact that there was some
            //error in updating the comments and the commentsRecords.

            //NOTE HERE THE COMMENT RECORD ARE USED TO SEND THE NOTIFICATION TO THE
            //PERSON WHOSE PROFILE HAS BEEN COMMENTED ON AND HAS NOTHING TO DO WITH THE
            //UI OF THE CURRENT USER. THANK YOU.
        })
    }
}