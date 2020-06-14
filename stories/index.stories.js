import React from "react";
import { storiesOf, addParameters } from "@storybook/react";

import { Action, Provider, Store } from "../src";
import { useSelector } from "react-redux";

const page = storiesOf("default", module);

const DateTime = (props) => {
    const value = useSelector(state => state.default?.datetime);
    return (
        <div>{value}</div>
    )
}

page.add('index', () => {

    React.useEffect(() => {
        const timer = setInterval(() => {
            Store.dispatch(Action.update('datetime', new Date().toString()));
        }, 1000)
        return () => {
            timer && clearInterval(timer);
        }
    }, []);

    return (
        <Provider>
            <DateTime />
        </Provider>
    )
});