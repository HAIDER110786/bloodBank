import React from 'react'
import uuid from 'react-uuid';

function NewCommentNotificationComponent({myId,note}) {
    return(
        note._id === myId
        ?(
            <div key={uuid()}></div>
        )
        :(
            <div key={uuid()} className="commentNotificationDiv">
                <img src={'http://localhost:5000/'+note.dp} style={{marginRight:10}} height={30} width={30} alt="dp"/>
                <p>{note.name} commented on your profile</p>
            </div>    
        )
    )
}

export default NewCommentNotificationComponent
