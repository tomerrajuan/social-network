import React, { useEffect, useState } from "react";
import axios from "../axios";

export function FriendshipButton({ otherId }) {
    console.log("otherId is: ", otherId);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        axios
            .get(`/friendship-status/${otherId}`)
            .then(({ data }) => {
                setButtonText(data.buttonText);
            })
            .catch(err => console.log("error at checking status:", err));
    }, []);

    function submit() {

        if (buttonText == "Send friend request") {
            axios
                .post(`/send-friend-request/${otherId}`)
                .then(({ data }) => {
                    setButtonText(data.buttonText);
                })
                .catch(err => console.log("error at checking status:", err));
        }
        if (buttonText == "Cancel friend request") {
            axios
                .post(`/end-friendship/${otherId}`)
                .then(({ data }) => {
                    setButtonText(data.buttonText);
                })
                .catch(err => console.log("error at checking status:", err));
        }
        if (buttonText == "Accept friendship") {
            axios
                .post(`/accept-friend-request/${otherId}`)
                .then(({ data }) => {
                    setButtonText(data.buttonText);
                })
                .catch(err => console.log("error at checking status:", err));
        }
        if (buttonText == "End friendship") {
            axios
                .post(`/end-friendship/${otherId}`)
                .then(({ data }) => {
                    setButtonText(data.buttonText);
                })
                .catch(err => console.log("error at checking status:", err));
        }
    }
    return (
        <div>
            <button className="friendship-button" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
