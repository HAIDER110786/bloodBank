import React,{ useState,useEffect } from 'react';
import uuid from 'react-uuid';
import RequestNotificationComponent from '../../utils/profileUtils/requestNotificationComponent';
import NewCommentNotificationComponent from '../../utils/profileUtils/newCommentNotificationComponent';
import CommentComponent from '../../utils/profileUtils/commentComponent';
import RecordComponent from '../../utils/profileUtils/recordComponent';
import GeneralProfileSection from '../../utils/profileUtils/generalProfileSection';
import { 
    myProfileBioRecordsCommentsRequestsMessages,
    hideAlert,
    changeDP,
    toggleReload,
    appendNewComment,
    showRequests,
    requestResponse,
    showComments,
} from '../../store/actions';
import { connect } from 'react-redux';
import './myProfile.css';

function MyProfile({
    userData,
    userDataLoading,
    records,
    recordsLoading,
    comments,
    commentsLoading,
    showBloodRequestAlert,
    showNewCommentAlert,
    myProfileBioRecordsCommentsRequestsMessages,
    hideAlert,
    appendNewComment,
    changeDP,
    reloadAndRebowl,
    toggleReload,
    requestListData,
    requestListLoading,
    showRequests,
    requestResponse,
    commentListData,
    commentListLoading,
    showComments,
}){

    if(reloadAndRebowl){
        toggleReload(0);
        window.location.reload();
    }

    useEffect(() => {
        myProfileBioRecordsCommentsRequestsMessages();
    },[myProfileBioRecordsCommentsRequestsMessages])
    
    function handleClick(){
        window.location = localStorage.getItem('auth-token') ? '/dashboard' : '/';
    }
    
    const [DPButton,changeDPbutton] = useState(false);
    
    async function handleDPchange(e){
        changeDPbutton(true);
        const fs = new FormData();
        fs.append('file',e.target.files[0]);
        fs.append('id',userData[0]._id);
        changeDP(fs);
        changeDPbutton(false);
    }

    const [ requestListDropDown , toggleRequestListDropDown ] = useState(false);

    function togglingBloodRequestNotification(){

        //DON'T TOUCH THE LINE BELOW, the line just remove the alert if there is any
        showBloodRequestAlert && hideAlert('HIDE_BLOOD_REQUEST_ALERT');
        
        if(requestListDropDown){
            toggleRequestListDropDown(false);
        }
        else{
            toggleRequestListDropDown(true);
            showRequests();
        }
    }

    const [ commentListDropDown , toggleCommentListDropDown ] = useState(false);

    function togglingNewCommentNotifcation(){

        //DON'T TOUCH THE LINE BELOW, the line just removes the alert if there is any
        showNewCommentAlert && hideAlert('HIDE_NEW_COMMENT_ALERT');

        if(commentListDropDown){
            toggleCommentListDropDown(false);
        }
        else{
            toggleCommentListDropDown(true);
            showComments();
        }
    }
    

    function Response(id,response,requester) {

        //don't touch the line below
        toggleRequestListDropDown(true);
        
        requestResponse(id,response,requester,userData[0].name)
    }

    !localStorage.getItem('auth-token') && (window.location = '/')

    function postComment(e){
        disabledCommentsButton(true);
        const comment = e.target.previousElementSibling.value.trim();
        comment ? appendNewComment(comment) : alert('no empty comments allowed')
        disabledCommentsButton(false);
        setCommentValue('');
    }
    
    const [commentsButton,disabledCommentsButton] = useState(false);

    const [commentValue,setCommentValue] = useState('');

    return (
        <div className="myProfile">
            {showBloodRequestAlert ? <div className="redDotCommentNotification"></div> : <div></div>}
            {showNewCommentAlert ? <div className="redDotNotification"></div> : <div></div>}
            {
                requestListDropDown
                ? 
                (
                    requestListLoading
                    ?(
                        <div className="notification_loading">
                            Loading...
                        </div>  
                    ) 
                    :(
                        <div className="notification">
                            {
                                //keep in mind the requestList.status thing here
                                requestListData.length 
                                ? 
                                (
                                    requestListData.map(note => <RequestNotificationComponent Response={Response} key={note._id} />)
                                ) 
                                : 
                                (
                                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'red' }}><p style={{ color: 'red' }}>You don't have any request yet</p></div>
                                )
                            }
                        </div>
                    )
                )
                : 
                (
                    <div className="closed">
                    </div>
                )
            }
            {
                commentListDropDown
                ?
                (
                    commentListLoading
                    ? <div className="comment_notification_loading">Loading...</div>
                    : 
                    (                    
                        <div className="comment_notification">
                            {
                                commentListData
                                ? (
                                    commentListData.map(note => <NewCommentNotificationComponent key={uuid()} myId={userData[0]._id} note={note} /> )
                                )
                                : (
                                    <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',color:'red'}}><p style={{color:'red'}}>You don't have any comments from anybody yet</p></div>
                                )
                            }
                        </div>
                    )
                )
                : <div className="closed"></div>
            }

            <div className="header">
                <div onClick={handleClick} className="backArrow">&#x2190;</div>
                <div className="space"></div>
                <span role="img" aria-label="bell-icon" onClick={togglingNewCommentNotifcation} className="notification_bell">&#128172;</span>
                <span role="img" aria-label="comment-icon" onClick={togglingBloodRequestNotification} className="notification_bell">&#128276;</span>
            </div>        
                   
            <div className="fullProfile">
                {
                    userDataLoading
                    ?
                    (
                        <div style={{ width: '23.14%', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
                    )
                    :
                    (
                        <GeneralProfileSection userData={userData[0]} handleDPchange={handleDPchange} DPButton={DPButton}/>
                    )
                }
                <div className="comments">
                    <div className="posts">
                        <div className="heading"><h2>Comments</h2></div>
                        <div className="messages">
                            {
                                commentsLoading
                                ? (
                                    <div style={{height:350,display:'flex',alignItems:'center',justifyContent:'center',color:'rgb(211, 47, 47)'}}>Loading...</div>
                                )
                                : (
                                    comments
                                    ? (
                                        comments.map(comment=><CommentComponent key={uuid()} comment={comment}/>)
                                    )
                                    : (
                                        <div style={{ color: 'rgb(211, 47, 47)', display: 'flex', height: 350, alignItems: 'center', justifyContent: 'center' }}><p style={{ margin: 0 }}>You dont have any comments yet</p></div>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <div className="input">
                        <input onChange={e => {setCommentValue(e.target.value)} } value={commentValue} placeholder='Enter Your Comments Here' type="text"/><button disabled={commentsButton} onClick={postComment}>POST</button>
                    </div>
                </div>
                <div className="record">
                    <h2>Records</h2>
                    {
                        recordsLoading
                        ? 
                        (
                            <div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',color:'white',marginTop:-30}}>  
                                Loading...
                            </div>
                        )
                        :
                        (
                            (records && records.length > 0) 
                            ?(
                                records.map(record=><RecordComponent key={uuid()} record={record}/>)
                            )
                            :(
                                <div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',color:'white',marginTop:-30}}>
                                    You haven't accepted or rejected any blood donation records yet
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    userData : state.myProfileReducer.userData ,
    userDataLoading : state.myProfileReducer.userDataLoading ,
    records : state.myProfileReducer.records ,
    recordsLoading : state.myProfileReducer.recordsLoading ,
    comments : state.myProfileReducer.comments ,
    commentsLoading : state.myProfileReducer.commentsLoading ,
    RequestedBlood : state.myProfileReducer.RequestedBlood ,
    error : state.myProfileReducer.error ,
    showBloodRequestAlert : state.myProfileReducer.showBloodRequestAlert , 
    showNewCommentAlert : state.myProfileReducer.showNewCommentAlert , 
    reloadAndRebowl : state.myProfileReducer.reloadAndRebowl ,
    requestListData : state.myProfileReducer.requestListData ,
    requestListLoading : state.myProfileReducer.requestListLoading ,
    commentListData : state.myProfileReducer.commentListData ,
    commentListLoading : state.myProfileReducer.commentListLoading ,
})

const mapDispatchToProps = {
    myProfileBioRecordsCommentsRequestsMessages,
    hideAlert,
    toggleReload,
    changeDP,
    appendNewComment,
    showRequests,
    requestResponse,
    showComments,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)