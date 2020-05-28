import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { unfriend } from "../actions";

export default function makeFriend() {
    const dispatch = useDispatch();
    const users = useSelector(
        state => state.users && state.users.filter(user => user.makeFriend)
    );
    if (!users) {
        return null;
    }
    console.log(users);
    const hotUsers = (
        <div className="users">
            {users.map(user => (
                <div className="user">
                    <img src={user.url} />
                    <div className="buttons">
                        <button onClick={e => dispatch(unfriend(user.id))}>
                            unfriend
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div id="accept">
            {!users.length && <div>Nobody is hot!</div>}
            {!!users.length && hotUsers}
            <nav>
                <Link to="/">Home</Link>
                <Link to="/unfriend">See who you unfriended</Link>
            </nav>
        </div>
    );
}
