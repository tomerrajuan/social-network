import React from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
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
            <div className="registration">
                <div className="fields">
                    {this.state.error && (
                        <div className="error">
                            oops. make sure to fill out all the required fields
                        </div>
                    )}
                    <input
                        name="first"
                        placeholder="first name"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        name="last"
                        placeholder="last name"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        name="email"
                        placeholder="email"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <button onClick={e => this.submit()}>Submit</button>
                    <Link to="/login">Already have an account?</Link>
                </div>
            </div>
        );
    }
}
