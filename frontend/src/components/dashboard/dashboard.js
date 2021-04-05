import React, {useState} from 'react';
import { useHistory , Redirect } from 'react-router-dom';
import UserList from '../../utils/dashboardUtils/userList';
import {connect} from 'react-redux';
import './dashboard.css';
import { dashboardAction } from '../../store/actions';

function Dashboard({
    isLoading,
    users,
    error,
    dashboardAction,
}){

    const [filter,setFilter] = useState('All')
    
    const history = useHistory();
    
    React.useEffect(() => {
        dashboardAction();
        return () => window.location.reload();
    },[dashboardAction])

    function handleSelect(e){
        const currentfilter = e.target.value;
        setFilter(currentfilter);
    }

    const no_match = <div className="no_match"> No Match Found </div>;
    const no_users = <div className="no_match"> Sorry There Are No Users </div>;
    const loading =  <div className="loading"> Loading... </div>;

    function showError(error){
        return <div className="no_match">
            {
                error === "Request failed with status code 404"
                ? 'Error 404'
                : error
            }
        </div>;
    }

    const usersList = users.length > 0 
    ? users
    .filter(user => filter === 'All' ? user : user.blood_group === filter)
    .map(user => <UserList users={user} key={user._id} /> )
    : no_users
    
    function handleLogout(){
        localStorage.removeItem('auth-token')
        history.push('/');
    }
    
    if(!localStorage.getItem('auth-token')){
        return <Redirect to='/'/>
    }
    
    return(
        <div className="dashboard">
            <div className="header">
                <div className="logo">BLOOD BANK</div>
                <div className="spacing"></div>
                <div className="links">
                    <ul>
                        <li onClick={()=>history.push('/myProfile')}>Your Profile</li>
                        <li onClick={handleLogout}>Log Out</li>
                    </ul>
                </div>
            </div>
            <div className="searchBar">
                <select defaultValue={'Default'} 
                onChange={handleSelect}
                >
                    <option value="Default" disabled>
                        FILTER YOUR REQUIRED BLOOD GROUP
                    </option>
                    <option value="All">All</option>
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
                {
                    isLoading 
                    ? loading
                    : error 
                      ? showError(error)
                      : usersList.length > 0 
                        ? usersList 
                        : no_match
                }
            </div>
        </div>
    ) 
}

const mapStateToProps = state => ({
    isLoading: state.dashboardReducer.isLoading,
    users: state.dashboardReducer.users,
    error: state.dashboardReducer.error,
})

const mapDispatchToProps = {
    dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)