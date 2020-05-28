import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";

export function Chat() {
    const chatMessages = useSelector(state => state && state.tenMessages);
    const onlineUsers = useSelector(state => state && state.newUserOnline);

    const elemRef = useRef();

    useEffect(() => {
        // elemRef.current.scrollTop =
        //     elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages, onlineUsers]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <textarea
                placeholder="add your message"
                onKeyDown={keyCheck}
            ></textarea>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(chatMessage => (
                        <div key={chatMessage.id}>
                            <div className="chat-message-div">
                                <div className="name-img">
                                    <h2 className="name-friends-chat">
                                        {chatMessage.first} {chatMessage.last}
                                    </h2>
                                    <img
                                        className="chat-img"
                                        src={chatMessage.url}
                                    />
                                </div>

                                <p className="chat-message">
                                    {chatMessage.message}
                                </p>
                                <h6>{chatMessage.created_at}</h6>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="onlineUsers-container">
                {onlineUsers &&
                    onlineUsers.map(onlineUser => (
                        <div key={onlineUser.id}>
                            <div className="chat-online-div">
                                <div className="name-img">
                                    <h3 id="green"></h3>
                                    <h2 className="name-friends-chat">
                                        {onlineUser.first} {onlineUser.last}
                                    </h2>
                                    <img
                                        className="chat-img"
                                        src={onlineUser.url}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
