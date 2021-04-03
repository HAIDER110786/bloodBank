import React from 'react';
import {Link} from 'react-router-dom';

export default function UserList({users}){
    return(
        <Link className="post" to={`/profile/${users._id}`} key={users._id}>            
            <img src={'http://localhost:5000/'+users.dp} alt="" height={200} width={200}/>
            <div className="mini-profile">
                <p>{users.name}</p>
                <p>{users.age}</p>
                <p>{users.blood_group}</p>
            </div>
        </Link>
    )
}