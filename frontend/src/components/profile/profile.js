import React,{ useState , useEffect } from 'react';
import { useParams , Redirect, useHistory } from 'react-router-dom';
import uuid from 'react-uuid';
import {
    profileMakeBloodRequest,
    profileUpdateCommentsCommentRecordsAndFetchNewComments,
    profileBioRecordsCommentsRequests
} from '../../store/actions';
import { connect } from 'react-redux';
import './profile.css';

function Profile(props){

    const {
        userData,
        userDataLoading,
        records,
        recordsLoading,
        comments,
        commentsLoading,
        RequestedBlood,
        profileMakeBloodRequest,
        profileUpdateCommentsCommentRecordsAndFetchNewComments,
        profileBioRecordsCommentsRequests
    } = props;

    const history = useHistory();

    const {id} = useParams();
    
    const [requestbutton,disableRequestbutton] = useState(false);
    const [postCommentbutton,disablePostCommentbutton] = useState(false);
    const [clearCommentInput,resetCommentInput] = useState('');

    useEffect(() => {
        profileBioRecordsCommentsRequests(id);
        return () => window.location.reload();
    }, [profileBioRecordsCommentsRequests,id])

    function handleClick(){
        localStorage.getItem('auth-token')
        ? history.push('/dashboard')
        : history.push('/')
    }

    function handleRequest(){
        disableRequestbutton(true);
        profileMakeBloodRequest(userData);
    }

    function postComment(e){
        const newComment = e.target.previousElementSibling.value.trim();
        if(newComment !== ''){
            disablePostCommentbutton(true);
            resetCommentInput('');
            profileUpdateCommentsCommentRecordsAndFetchNewComments(id,newComment)
        }
        else{
            alert('no empty comments allowed');
        }
    }

    if(!localStorage.getItem('auth-token')) window.location = '/';

    function doIT(e){
        resetCommentInput(e.target.value);
    }

    if(!id) return <Redirect to='/dashboard' />;

    return (
        <div className="profile">
            <div className="header">
                <div onClick={handleClick} className="backArrow">&#x2190;</div>
                <div className="space"></div>
            </div>
            <div className="fullProfile">
                {
                    userDataLoading
                    ?
                    (<div style={{ width: '23.14%', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>)
                    :
                    (<div className="userDetails">
                        <div>
                            <img src={'http://localhost:5000/' + userData.dp} alt="This is the bio pic" height={200} width={200} />
                            <p>{userData.name}</p>
                            <p>{userData.age}</p>
                            <p>{userData.number}</p>
                            <p>{userData.city}</p>
                            <p>{userData.blood_group}</p>
                            <p>{userData.requirements}</p>
                            {
                                RequestedBlood
                                ? <button disabled={true} className="request">Requested</button>
                                : <button disabled={requestbutton} onClick={handleRequest} className="request">Request Blood</button>
                            }
                        </div>
                    </div>)
                }
                <div className="comments">
                    <div className="posts">
                        <div className="heading"><h2>Comments</h2></div>
                        <div className="messages">
                            {
                                commentsLoading
                                ? 
                                (<div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(211, 47, 47)' }}>Loading...</div>)
                                : 
                                (comments
                                ? 
                                (comments.map(individualCommentDetails => {
                                        return(
                                            <div key={uuid()} className="message">
                                                <img src={'http://localhost:5000/' + individualCommentDetails.dp} style={{ marginRight: 10 }} width={30} height={30} alt="user name" />
                                                <div>
                                                    <h3>{individualCommentDetails.name}</h3>
                                                    <p style={{ color: 'black' }}>{individualCommentDetails.comment}</p>
                                                </div>
                                            </div>
                                        )
                                }))
                                : 
                                (<div style={{ color: 'rgb(211, 47, 47)', display: 'flex', height: 350, alignItems: 'center', justifyContent: 'center' }}><p style={{ margin: 0 }}>You dont have any comments yet</p></div>))
                            }
                        </div>
                    </div>
                    <div className="input">
                        <input
                            value={clearCommentInput}
                            onChange={doIT} 
                            type="text"
                        />
                        <button
                            disabled={postCommentbutton}
                            onClick={postComment}
                        >
                            POST
                        </button>
                    </div>
                </div>
                <div className="record">
                    <h2>Record</h2>
                    {
                        recordsLoading
                        ? 
                        (<div style={{ height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading records...</div>)
                        :
                        (records.length > 0
                        ?
                        (records.map(record => {
                            return(
                                <div key={uuid()} className="individualRecord">
                                    <p>{record}</p>
                                </div>
                            )
                        }))
                        : 
                        (<div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: -30 }}>
                            This user does not have any blood donation records yet
                        </div>))
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    userData : state.profileReducer.userData ,
    userDataLoading : state.profileReducer.userDataLoading ,
    records : state.profileReducer.records ,
    recordsLoading : state.profileReducer.recordsLoading ,
    comments : state.profileReducer.comments ,
    commentsLoading : state.profileReducer.commentsLoading ,
    RequestedBlood : state.profileReducer.RequestedBlood ,
    error : state.profileReducer.error ,
})

const mapDispatchToProps = {
    profileMakeBloodRequest,
    profileUpdateCommentsCommentRecordsAndFetchNewComments,
    profileBioRecordsCommentsRequests
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)