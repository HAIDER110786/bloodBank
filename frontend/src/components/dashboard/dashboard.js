import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './dashboard.css';

export default function Dashboard(){

    const history = useHistory();

    const [authenticated,unauthenticate] = useState({
        token:localStorage.getItem('auth-token')
    });

    const [initialUsers] = useState({
        usersinit:[]
    })

    const [filter,setFilter] = useState({
        filterBy:'none'
    })

    const [appState,setAppState] = useState({
        loading:true,
        users:[]
    }) 

    useEffect(()=>{
        appState.loading = true;
        axios.get('http://localhost:5000/dashboard',
        {headers:
             {Authorization:localStorage.getItem('auth-token')}
        })
        .then(res => {
            appState.loading = false;
            appState.users = res.data;
            initialUsers.usersinit = res.data;
            setAppState({...appState,users: initialUsers.usersinit.map(user=>{
                return(
                    <div className="post" onClick={()=>{handleClick(user._id)}} key={user._id}>
                        <img src={'http://localhost:5000/'+user.dp} height={200} width={200}/>
                        <div className="mini-profile">
                            <p>{user.name}</p>
                            <p>{user.age}</p>
                            <p>{user.blood_group}</p>
                        </div>
                    </div>
                )
            })
        });
        })
        .catch(err => console.log(err));
    },[]);

    function handleSelect(e){
        filter.filterBy = e.target.value;
        setAppState({
            loading: false,
            users: initialUsers.usersinit
            .filter(user => user.blood_group === filter.filterBy)
            .map(user=>{
                    return(
                            <div className="post" onClick={()=>{handleClick(user._id)}} key={user._id}>
                                <img src={'http://localhost:5000/'+user.dp} height={200} width={200}/>
                                <div className="mini-profile">
                                    <p>{user.name}</p>
                                    <p>{user.age}</p>
                                    <p>{user.blood_group}</p>
                                </div>
                            </div>
                        )   
                    })
                });
    }

    function handleClick(id){
        let userData = initialUsers.usersinit.find(user=>user._id===id);
        if(localStorage.getItem('auth-token')){
             history.push({
                pathname: `/profile?id=${userData._id}`,
                data: 'reload'
              });
              window.location.reload();
        }
        else{ unauthenticate({token:localStorage.getItem('auth-token')})}
    }

    function handleClickForMyProfile(){
        if(localStorage.getItem('auth-token')){
             history.push({
                pathname: `/myProfile`,
              });
              window.location.reload();
        }
        else{ unauthenticate({token:localStorage.getItem('auth-token')})}
    }

    function handleLogout(){
        localStorage.removeItem('auth-token');
        unauthenticate({token:localStorage.getItem('auth-token')});
    }
    
    if(!authenticated.token){
        window.location = ('/');
    }

    return(
        <div className="dashboard">
            <div className="header">
                <div className="logo">BLOOD BANK</div>
                <div className="spacing"></div>
                <div className="links">
                    <ul>
                        <li onClick={handleClickForMyProfile}>Your Profile</li>
                        <li onClick={handleLogout}>Log Out</li>
                    </ul>
                </div>
            </div>
            <div className="searchBar">
                <select defaultValue={'Default'} onChange={handleSelect}>
                    <option value="Default" disabled>FILTER YOUR REQUIRED BLOOD GROUP</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                </select>
            </div>
            <div className="otherProfiles">
                {appState.loading ? (
                    <div className="loading">Loading...</div>
                ) : ( 
                    appState.users.length>0 ? (appState.users) : (<div className="no_match">No Match Found</div>)
                )}
            </div>
        </div>
    ) 
}