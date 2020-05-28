import React from "react";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <ul className="navbar">
                    <li>
                        <Link to="/"><ion-icon name="home"></ion-icon> Profile</Link>
                    </li>
                    <li>
                        <Link to="/friends"><ion-icon name="people"></ion-icon> Friends</Link>
                    </li>
                    <li>
                        <Link to="/search-user"><ion-icon name="person-add"></ion-icon> Find Friends</Link>
                    </li>
                    <li>
                        <Link to="/chat"><ion-icon name="chatboxes"></ion-icon> Chat</Link>
                    </li>
                    <li>
                        <a href="/logout"><ion-icon name="exit"></ion-icon> Logout</a>
                    </li>
                </ul>
            </div>
        );
    }
}
