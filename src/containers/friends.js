import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeFriend, receiveUsers, unfriend } from "../actions";

export default function NewFriends() {
    const dispatch = useDispatch();

    const wannabes = useSelector(state => {
        return (
            state.users &&
            state.users.filter(wannabe => wannabe.accepted == false)
        );
    });

    const friends = useSelector(state => {
        return (
            state.users && state.users.filter(friend => friend.accepted == true)
        );
    });

    useEffect(() => {
        dispatch(receiveUsers());
    }, []);

    if (!wannabes) {
        return null;
    }
    if (!friends) {
        return null;
    }

    return (
        <div className="friends">
            {wannabes.map(wannabe => (
                <div className="accept" key={wannabe.id}>
                    <div>
                        <h2 className="name-friends">
                            {wannabe.last} {wannabe.first}
                        </h2>
                        <img src={wannabe.url} />
                        <button onClick={e => dispatch(makeFriend(wannabe.id))}>
                            Accept request
                        </button>
                    </div>
                </div>
            ))}
            {friends.map(friend => (
                <div className="wannabes" key={friend.id}>
                    <div>
                        <h2 className="name-friends">
                            {friend.last} {friend.first}
                        </h2>
                        <img src={friend.url} />
                        <button onClick={e => dispatch(unfriend(friend.id))}>
                            Unfriend
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
