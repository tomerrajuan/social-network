import React from "react";
import { BioEditor } from "./bio-editor";
import { ProfilePic } from "./profile-pic";

export function Profile(props) {
    console.log("props in profile", props);
    return (
        <div className="container">
            <ProfilePic
                onChange={e => this.handleChange(e)}
                first={props.firstname}
                last={props.lastname}
                imgUrl={props.imgUrl}
                bio={props.bio}
                toggle={props.toggle}
            />
            <BioEditor bio={props.bio} updateBio={props.updateBio} />

            <div className="logo2">
            </div>
        </div>
    );
}
