import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import './profile.css';

export default function Profile(){
    const customAxios = axios.create({
        headers: {'Authorization':localStorage.getItem('auth-token')}
    });      
    
    const [requestbutton,disableRequestbutton] = useState(false);
    const [postbutton,disablePostbutton] = useState(false);

    const params = window.location.search;
    const ParamsList = new URLSearchParams(params);
    const id = ParamsList.get('id');

    if(!id){
        window.location = '/dashboard';
    }

    const [user,setUser] = useState({
        loading:true,
        data:null
    });

    const [authenticated,unauthenticate] = useState({
        token:localStorage.getItem('auth-token')
    });

    const [records,updateRecords] = useState('');

    const [comment,updateComments] = useState({
        data:[],
        loading:true
    })
    
    const [Requested,setRequest] = useState(true);

    useEffect(() => {
        setUser({...user,loading:true});
        updateComments({...comment,loading:true});
        axios.all([
            customAxios.post('http://localhost:5000/user',{id}),
            customAxios.get('http://localhost:5000/records/'+id),
            customAxios.get('http://localhost:5000/comments/'+id),
            customAxios.get('http://localhost:5000/mutualRequests/'+id),
        ])
        .then(res => {
            setUser({loading:false,data : res[0].data});
            if(res[1].data.recordsArray){
                if(res[1].data.recordsArray.length > 0){
                    updateRecords(res[1].data.recordsArray.map(currentRecord=>{
                        return <div className="individualRecord"><p>{currentRecord}</p></div>
                    }));
                }
                else{
                    updateRecords(<div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',justifyContent:'center',color:'white',marginTop:-30}}>You haven't accepted or rejected any blood donation records yet</div>);
                }
            }
            if(res[2].data){
                updateComments({loading:false,data:res[2].data.map(comments=>{
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
                updateComments({loading:false,data:<div style={{height:300,color:'rgb(211, 47, 47)',display:'flex',height:350,alignItems:'center',justifyContent:'center'}}><p style={{margin:0}}>You dont have any comments yet</p></div>})
            }
            setRequest(res[3].data.requested);
        })
        .catch(err => console.log(err));
    }, [])

    function handleClick(){
        if(localStorage.getItem('auth-token')){
             window.location = ('/dashboard');
        }
        else{ unauthenticate({token:localStorage.getItem('auth-token')})}
    }

    function handleRequest(e){
        disableRequestbutton(true);
        axios
        .post('http://localhost:5000/requests',{
            from:user.data,
        },{
            headers:{
                Authorization:localStorage.getItem('auth-token')
            }
        })
        .then(res => {
            disableRequestbutton(false);
            setRequest(true);
        })
        .catch(err => console.log(err));
        
    }

    function postComment(e){
        const newComment = e.target.previousElementSibling.value.trim();
        if(newComment !== ''){
            disablePostbutton(true);
            resetCommentInput('');
            updateComments({...comment,loading:true});        
            axios.all([
                customAxios.post('http://localhost:5000/comments/'+id,{newComment}),
                customAxios.post('http://localhost:5000/commentRecords/'+id)
            ])
            .then(() =>{
                customAxios.get('http://localhost:5000/comments/'+id)
                .then(res => {       
                    resetCommentInput('');
                    disablePostbutton(false);
                    updateComments({loading:false,data:res.data.map(comments=>{
                        return <div className="message">
                        <img src={'http://localhost:5000/'+comments.dp} style={{marginRight:10}} width={30} height={30} alt="user name"/>
                        <div>
                            <h3>{comments.name}</h3>
                            <p style={{color:'black'}}>{comments.comment}</p>
                        </div>
                    </div>  
                })});
                })
            })
            .catch(err =>{ 
                console.log(err)
            });
        }
        else{
            alert('no empty comments allowed');
        }
    }

    if(!authenticated.token){
        window.location = '/';
    }

    function doIT(e){
        resetCommentInput(e.target.value);
    }

    
    const [clearCommentInput,resetCommentInput] = useState(null);

    return (
        <div className="profile">
            <div className="header">
                <div onClick={handleClick} className="backArrow">&#x2190;</div>
                <div className="space"></div>
            </div>                 
            {user.loading?(
                    <div className="loading">Loading...</div>
                ):(
            <div className="fullProfile">
                <div className="userDetails">
                    <div>
                        <img src={'http://localhost:5000/'+user.data.dp} alt="This is the bio pic" height={200} width={200}/>
                        <p>{user.data.name}</p>
                        <p>{user.data.age}</p>
                        <p>{user.data.number}</p>
                        <p>{user.data.city}</p>
                        <p>{user.data.blood_group}</p>
                        <p>{user.data.requirements}</p>
                        {Requested ? (
                            <button disabled={true} className="request">Requested</button>
                        ) : (
                            <button disabled={requestbutton} onClick={handleRequest} className="request">Request Blood</button>
                        )}
                    </div>
                </div>
                <div className="comments">
                    <div className="posts">
                        <div className="heading"><h2>Comments</h2></div>
                        <div className="messages">
                            {comment.loading?(
                                <div style={{height:350,display:'flex',alignItems:'center',justifyContent:'center',color:'rgb(211, 47, 47)'}}>Loading...</div>
                            ):(
                                comment.data
                            )}
                        </div>
                    </div>
                    <div className="input">
                        <input value={clearCommentInput} onChange={doIT} type="text"/><button disabled={postbutton} onClick={postComment}>POST</button>
                    </div>
                </div>
                <div className="record">
                    <h2>Record</h2>
                    {records.length>0 ? (
                        records
                    ):(
                        <div style={{display:'flex',height:'100%',justifyContent:'center',alignItems:'center',justifyContent:'center',color:'white',marginTop:-30}}>
                            This user does not have any blood donation records yet
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    )
}