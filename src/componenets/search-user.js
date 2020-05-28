import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export function SearchUsers() {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [latestUsers, latestSetUser] = useState([]);

    useEffect(() => {
        axios.get(`/api/search-user`).then(data => {

            latestSetUser(latestUsers.concat(data.data.results.rows));
        });
    }, []);

    useEffect(() => {
        let ignore = false;
        if (searchValue == "") {
            setUsers([]);
            return;
        }
        axios
            .get(`/search-user/${searchValue}`)
            .then(data => {
                if (!ignore) {
                    setUsers(data.data.results.rows);
                } else {
                    setUsers([]);
                }
            })
            .catch(err => console.log("error at get users", err));
        return () => (ignore = true);
    }, [searchValue]);
    if (!users) {
        return null;
    }

    return (
        <div className="search-users">

            <p id="search-for-friends">Search for friends</p>
            <input id="input-search-friends" onChange={e => setSearchValue(e.target.value)} />
            {latestUsers.map(user => (
                <div key={user.id}>
                    <h3 className="name-friends">
                        {user.last} {user.first}
                    </h3>
                    <Link to={`/user/${user.id}`}><img className="other-users-img" src={user.url} />
                    </Link>
                </div>
            ))}
            <div>
                {users.map(user => (
                    <div key={user.id}>
                        <h2 className="name-friends">
                            {user.first} {user.last}
                        </h2>
                        <Link to={`/user/${user.id}`}><img className="other-users-img" src={user.url} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
