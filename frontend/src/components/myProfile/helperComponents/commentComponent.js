import React from 'react'
import uuid from 'react-uuid'

function CommentComponent({comment}) {
    return (
        <div key={uuid()} className="message">
            <img src={'http://localhost:8000/' + comment.dp} style={{ marginRight: 10 }} width={30} height={30} alt="user name" />
            <div>
                <h3>{comment.name}</h3>
                <p style={{ color: 'black' }}>
                    {comment.comment}
                </p>
            </div>
        </div>
    )
}

export default CommentComponent
