import React from "react";

export function ProfilePic({ firstname, lastname, imgUrl, bio, toggle }) {
    imgUrl = imgUrl || "/default.png";
    return (
        <div>
            <h2 className="name">
                {firstname} {lastname}
            </h2>

            <img className="profile-pic" src={imgUrl} onClick={toggle} />
            <div className="bio-container">
                <h4 className="bio">{bio}</h4>
            </div>
        </div>
    );
}
