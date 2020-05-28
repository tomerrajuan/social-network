import React from "react";
import { Link } from "react-router-dom";

export default function Not() {
    const users = null;
    if (!users) {
        return null;
    }
    const notUsers = (
        <div className="users">
            {users.map(user => (
                <div className="user">
                    <img src={user.url} />
                    <div className="buttons">
                        <button>accept friendship</button>
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div id="unfriend">
            {!users.length && <div>Nobody is not hot!</div>}
            {!!users.length && notUsers}
            <nav>
                <Link to="/">Home</Link>
                <Link to="/accept">See who you just added</Link>
            </nav>
        </div>
    );
}
