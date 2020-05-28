import React from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    login() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("success");

                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(input) {
        this.setState({
            [input.name]: input.value
        });
    }
    render() {
        return (
            <div className="login">
                <div className="fields">
                    {this.state.error && (
                        <div className="error">
                            oops. make sure to fill out all the required fields
                        </div>
                    )}
                    <input
                        name="email"
                        onChange={e => this.handleChange(e.target)}
                        placeholder="email"
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={e => this.handleChange(e.target)}
                        placeholder="password"

                    />
                    <button onClick={e => this.login(e)}>login</button>
                    <Link to="/">Dont have an account</Link>
                </div>
            </div>
        );
    }
}
