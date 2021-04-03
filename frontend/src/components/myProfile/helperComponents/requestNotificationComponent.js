import React from 'react'

function RequestComponent({ note , Response }) {
    return (
        <div className="notify" key={note._id}>
            <div style={{ display: 'flex' }}>
                <img src={'http://localhost:5000/' + note.dp} style={{ marginRight: 10 }} height={30} width={30} alt="dp" />
                <p style={{ margin: 0, marginTop: 5 }}>{note.name} asked you for blood</p>
            </div>
            <div className="response">
                <button onClick={_ => Response(note._id, 'accepted', note.name)} style={{ color: 'blue' }}>Accept</button>
                <button onClick={_ => Response(note._id, 'rejected', note.name)} style={{ color: 'green' }}>Decline</button>
            </div>
        </div>
    )
}

export default RequestComponent;