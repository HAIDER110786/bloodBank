import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './myProfile.css';

export default function MyProfile(){

    const customAxios = axios.create({
        headers: {'Authorization':localStorage.getItem('auth-token')}
    });

     const [authenticated,unauthenticate] = useState({
        token:localStorage.getItem('auth-token')
    });
    
    const [user,setUser] = useState({
        loading:true,
        data:null
    });

    const [comments,addComments] = useState({
        loading: false,
        data:[]
    })
    
    const [notificationAlert,showNotificationAlert] = useState(false);
    const [commentNotificationAlert,showCommentNotificationAlert] = useState(false);

    useEffect(() => {
        setUser({...user,loading:true});  
        addComments({...comments,loading:true});  
        axios.all([
            customAxios.get('http://localhost:5000/myProfile'),
            customAxios.get('http://localhost:5000/records'),
            customAxios.get('http://localhost:5000/comments'),
            customAxios.get('http://localhost:5000/newRequest'),
            customAxios.get('http://localhost:5000/newComment'),
        ])
        .then(res => {
            setUser({loading:false,data : res[0].data});
            if(res[1].data!==''){
                updateRecords({
                    loading:false,
                    data:res[1].data.recordsArray.map(currentRecord =>{
                        return <div className="individualRecord"><p>{currentRecord}</p></div>
                    })
                });
            }
            if(res[2].data.length>0){
                addComments({loading:false,data:res[2].data.map(comments=>{
                    return <div className="message">
                        <img src={'http://localhost:5000/'+comments.dp} style={{marginRight:10}} width={30} height={30} alt="user name"/>
                        <div>
                            <h3>{comments.name}</h3>
                            <p style={{color:'black'}}>{comments.comment}</p>
                        </div>
                    </div>
                })});
            }
            else{
                addComments({loading:false,data:<div style={{height:300,color:'rgb(211, 47, 47)',display:'flex',height:350,alignItems:'center',justifyContent:'center'}}><p style={{margin:0}}>You dont have any comments yet</p></div>})
            }
            if(res[3].data.request){
                showNotificationAlert(true);
            }
            if(res[4].data.msg){
                showCommentNotificationAlert(true);
            }
        })
        .catch(err => console.log(err))
    }, [])
    
    function handleClick(){
        if(localStorage.getItem('auth-token')){
            window.location = ('/dashboard');
        }
        else{ unauthenticate({token:localStorage.getItem('auth-token')})}
    }
    
    const [DPButton,changeDPbutton] = useState(false);
    
    async function handleChange(e){
        changeDPbutton(true);
        const fs = new FormData();
        fs.append('file',e.target.files[0]);
        fs.append('id',user.data[0]._id);
        axios
        .post('http://localhost:5000/profile/images',
        fs,
        {
            header:{
                Authorization:localStorage.getItem('auth-token'),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(()=>{
            changeDPbutton(false);
            window.location.reload();
        })
        .catch(e=>{
            console.error(e);
        })
    }
    
    
    const [notification,setNotification] = useState({
        dropdownOpen:false,
        data:[],
        loading:false
    })
    
    
    const [commentNotification,setCommentNotification] = useState({
        dropdownOpen:false,
        data:[],
        loading:false
    })

    function togglingAndLoading(){
        if(notificationAlert){
            showNotificationAlert(false);
            customAxios.post('http://localhost:5000/hideRequests')
        }
        toggleDropDown();
        LoadNotifications();
    }

    function togglingAndLoadingCommentNotifcation(){
        if(commentNotificationAlert){
            showCommentNotificationAlert(false);
            customAxios.post('http://localhost:5000/hideComments')
        }
        toggleCommentsDropDown();
        LoadCommentsNotifications();
    }

    function toggleDropDown(){
        if(notification.dropdownOpen){
            setNotification({...notification, loading:false, dropdownOpen : false});
            notification.dropdownOpen=false;
            notification.loading=false;
        }
        else{
            setNotification({...notification, loading:true, dropdownOpen : true});
            notification.dropdownOpen=true;
            notification.loading=true;
            commentNotification.dropdownOpen=false;
            commentNotification.loading=false;
        }
    }

    function toggleCommentsDropDown(){
        if(commentNotification.dropdownOpen){
            setCommentNotification({...commentNotification, loading:false, dropdownOpen : false});
            commentNotification.dropdownOpen=false;
            commentNotification.loading=false;
        }
        else{
            setCommentNotification({...commentNotification, loading:true, dropdownOpen : true});
            commentNotification.dropdownOpen=true;
            commentNotification.loading=true;
            notification.dropdownOpen=false;
            notification.loading=false;
        }
    }

    function LoadNotifications(){
        if(notification.dropdownOpen){
            axios.get('http://localhost:5000/notifications',{
                headers: {Authorization:localStorage.getItem('auth-token')}
            })
            .then(res => {
                if(!(res.data.status)){
                    setNotification({...notification, loading:false, data:res.data.map(note =>{
                        return(
                            <div className="notify" key={note._id}>
                                <div style={{display:'flex'}}>
                                    <img src={'http://localhost:5000/'+note.dp} style={{marginRight:10}} height={30} width={30} alt="dp"/>
                                    <p style={{margin:0,marginTop:5}}>{note.name} asked you for blood</p>
                                </div>
                                <div className="response">
                                    <button onClick={()=>Response(note._id,'accepted',note.name)} style={{color: 'blue'}}>Accept</button>
                                    <button onClick={()=>Response(note._id,'rejected',note.name)} style={{color: 'green'}}>Decline</button>
                                </div>
                            </div>
                        )
                    })
                    })
                }
                else{
                    setNotification({...notification, loading:false, data:res.data.status})
                }
            })
            .catch(err => {
                console.log(err)
            });
        }
    }

    function LoadCommentsNotifications(){
        if(commentNotification.dropdownOpen){
            axios.get('http://localhost:5000/comments',{
                headers: {Authorization:localStorage.getItem('auth-token')}
            })
            .then(res => {
                if(res.data.length>0){
                    setCommentNotification({...commentNotification, loading:false, data:res.data.map(note =>{
                        return note._id===user.data[0]._id?(
                            <div></div>
                        ):(
                            <div className="commentNotificationDiv">
                                <img src={'http://localhost:5000/'+note.dp} style={{marginRight:10}} height={30} width={30} alt="dp"/>
                                <p>{note.name} commented on your profile</p>
                            </div>    
                        )
                    })
                    })
                }
                else{
                    setCommentNotification({...commentNotification, loading:false, data:null});
                }
            })
            .catch(err => {
                console.log(err)
            });
        }
    }

    const [records,updateRecords] = useState({
        loading: false, 
        data:[]
    })

    function Response(id,response,requester) {
        updateRecords({...records,loading:true});
        setNotification({...notification, loading:true, dropdownOpen : true});
        axios.all([
            customAxios.delete('http://localhost:5000/requests/'+id),
            customAxios.post('http://localhost:5000/records/'+response,
            {
                requester:requester,
                date:moment().format('LLLL'),
                requestee:user.data[0].name
            }),
            customAxios.get('http://localhost:5000/notifications')
            //the 4th axios request is moved down
        ])
        .then(res=>{                 
            if(!(res[2].data.status)){
            setNotification({...notification, loading:false, data:res[2].data.map(note =>{
                return(
                    <div className="notify" key={note._id}>
                        <div style={{display:'flex'}}>
                            <img src={'http://localhost:5000/'+note.dp} style={{marginRight:10}} height={30} width={30} alt="dp"/>
                            <p style={{margin:0,marginTop:5}}>{note.name} asked you for blood</p>
                        </div>
                        <div className="response">
                            <button onClick={()=>Response(note._id,'accepted',note.name)} style={{color: 'blue'}}>Accept</button>
                            <button onClick={()=>Response(note._id,'rejected',note.name)} style={{color: 'green'}}>Decline</button>
                        </div>
                    </div>
                )
            })
            })}
            else{
                setNotification({...notification, loading:false, data:res[2].data.status})
            }
            customAxios.get('http://localhost:5000/records')
            .then(response => {
                if(response.data!==''){
                    updateRecords({
                        loading:false,
                        data:response.data.recordsArray.map(currentRecord =>{
                            return <div className="individualRecord"><p>{currentRecord}</p></div>
                        })
                    });
                }
            })
        })
        .catch(err=>{
            console.log(err)
        });
    }

    if(!authenticated.token){
        window.location = ('/');
    }

    function postComment(e){
        disabledCommentsButton(true);
        const comment = e.target.previousElementSibling.value.trim();
        if(comment !== ''){
            addComments({...comments,loading:true});
            customAxios.post('http://localhost:5000/comments',{comment})
            .then(() =>{  
                disabledCommentsButton(false);
                customAxios.get('http://localhost:5000/comments')
                .then(res => {
                    addComments({loading:false,data:res.data.commentDetails.map(comments=>{
                        return <div key={comments._id} className="message"><p>{comments.comment}</p></div>
                    })});
                })
                window.location.reload();
            })
            .catch(err =>{
                console.log(err)
            });
        }
        else{
            alert('no empty comments allowed');
        }
    }

    const [commentsButton,disabledCommentsButton] = useState(false);

    const [commentValue,setCommentValue] = useState('this is the comment value');

    return (
        <div className="myProfile">
            {
                notificationAlert ? (
                    <div className="redDotCommentNotification"></div>
                ):(
                    <div></div>
                )
            }
            {
                commentNotificationAlert ? (
                    <div className="redDotNotification"></div>
                ):(
                    <div></div>
                )
            }
            {notification.dropdownOpen===true ?(
                notification.loading===true ? (
                    <div className="notification_loading">  
                        Loading...
                    </div>
                ) : (                    
                    <div className="notification">
                        {notification.data.length>0 ? (
                            notification.data
                        ):(
                            <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',color:'red'}}><p style={{color:'red'}}>You don't have any notifications yet</p></div>
                        )}
                    </div>
                )
            ):(                  
                <div className="closed">
                </div>
            )}
            {commentNotification.dropdownOpen===true ?(
                commentNotification.loading===true ? (
                    <div className="comment_notification_loading">  
                        Loading...
                    </div>
                ) : (                    
                    <div className="comment_notification">
                        {commentNotification.data ? (
                            commentNotification.data
                        ):(
                            <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',color:'red'}}><p style={{color:'red'}}>You don't have any comments from anybody yet</p></div>
                        )}
                    </div>
                )
            ):(                  
                <div className="closed">
                </div>
            )}
            <div className="header">
                <div onClick={handleClick} className="backArrow">&#x2190;</div>
                <div className="space"></div>
                <div onClick={togglingAndLoadingCommentNotifcation} className="notification_bell">&#128172;</div>
                <div onClick={togglingAndLoading} className="notification_bell">&#128276;</div>
            </div>                 
            {user.loading?(
                    <div className="loading">Loading...</div>
                ):(
            <div className="fullProfile">
                <div className="userDetails">
                    <div>
                        <img src={'http://localhost:5000/'+user.data[0].dp} alt="This is the bio pic" height={200} width={200}/>
                        <input type="file" id="img" accept="image/*" style={{display:'none'}} disabled={DPButton} onChange={handleChange}/>
                        <label htmlFor="img" className="Upload_Image">Upload new image</label>
                        <p>{user.data[0].name}</p>
                        <p>{user.data[0].age}</p>
                        <p>{user.data[0].number}</p>
                        <p>{user.data[0].city}</p>
                        <p>{user.data[0].blood_group}</p>
                        <p>{user.data[0].requirements}</p>
                    </div>
                </div>
                <div className="comments">
                    <div className="posts">
                        <div className="heading"><h2>Comments</h2></div>
                        <div className="messages">
                            {comments.loading?(
                                <div style={{height:350,display:'flex',alignItems:'center',justifyContent:'center',color:'rgb(211, 47, 47)'}}>Loading...</div>
                            ):(
                                comments.data
                            )}
                        </div>
                    </div>
                    <div className="input">
                        <input placeholder='Enter Your Comments Here' type="text"/><button disabled={commentsButton} value={commentValue} onClick={postComment}>POST</button>
                    </div>
                </div>
                <div className="record">
                    <h2>Records</h2>
                    {records.loading ? (
                    <div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',justifyContent:'center',color:'white',marginTop:-30}}>  
                        Loading...
                    </div>
                    ):(
                        records.data.length>0 ? (
                            records.data
                        ):(
                            <div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',justifyContent:'center',color:'white',marginTop:-30}}>You haven't accepted or rejected any blood donation records yet</div>
                        )
                    )}
                </div>
            </div>
            )}
        </div>
    )
}