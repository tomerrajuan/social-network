import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter, Route,Link,Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
import { App } from "./app";
import Welcome from "./containers/welcome";
import reducer from "./reducer";
import { init } from './socket';

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);


let elem = <Welcome/>;

if (location.pathname != "/welcome") {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
        
    );
}

ReactDOM.render(elem, document.querySelector("main"));
