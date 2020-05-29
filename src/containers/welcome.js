import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Register from "./registration";
export default Welcome;

function Welcome() {
    return (
        <div className="welcome">
            <div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
