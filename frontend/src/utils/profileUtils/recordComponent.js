import React from 'react'
import uuid from 'react-uuid'

function RecordComponent({record}) {
    return (
        <div key={uuid()} className="individualRecord"><p>{record}</p></div>
    )
}

export default RecordComponent
