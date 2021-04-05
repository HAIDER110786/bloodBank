import React from 'react'

function ProfileSection({userData,DPButton,handleDPchange}) {
    return (
        <div className="userDetails">
            <div>
                <img src={'http://localhost:8000/' + userData[0].dp} alt="This is the bio pic" height={200} width={200} />
                <input type="file" id="img" accept="image/*" style={{ display: 'none' }} disabled={DPButton} onChange={handleDPchange} />
                <label htmlFor="img" className="Upload_Image">Upload new image</label>
                <p>{userData[0].name}</p>
                <p>{userData[0].age}</p>
                <p>{userData[0].number}</p>
                <p>{userData[0].city}</p>
                <p>{userData[0].blood_group}</p>
                <p>{userData[0].requirements}</p>
            </div>
        </div>
    )
}

export default ProfileSection
