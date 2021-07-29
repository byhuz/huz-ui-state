import React from "react";
import { createStore } from "redux";
import { Provider, useSelector } from "react-redux";
import reducer from "./reducer";

const debug = true;
const store = debug
    ? createStore(
        reducer,
        typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
    )
    : createStore(reducer);

const provider = ({ children }) => <Provider store={store}>{children}</Provider>;

export { provider as Provider, store as Store, useSelector };