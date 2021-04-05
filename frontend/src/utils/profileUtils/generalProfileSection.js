import React from 'react'

function generalProfileSection({userData,DPButton,handleDPchange,RequestedBlood,requestbutton,handleRequest}) {
    return (
        <div className="userDetails">
            <div>
                <img src={'http://localhost:8000/' + userData.dp} alt="This is the bio pic" height={200} width={200} />
                {handleDPchange && <input type="file" id="img" accept="image/*" style={{ display: 'none' }} disabled={DPButton} onChange={handleDPchange} />}
                {handleDPchange && <label htmlFor="img" className="Upload_Image">Upload new image</label>}
                <p>{userData.name}</p>
                <p>{userData.age}</p>
                <p>{userData.number}</p>
                <p>{userData.city}</p>
                <p>{userData.blood_group}</p>
                <p>{userData.requirements}</p>
                {
                    handleRequest && RequestedBlood
                    ? <button disabled={true} className="request">Requested</button>
                    : <button disabled={requestbutton} onClick={handleRequest} className="request">Request Blood</button>
                }
            </div>
        </div>
    )
}

export default generalProfileSection
