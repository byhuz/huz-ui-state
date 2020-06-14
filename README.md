```js

import { Action, Store } from "@byhuz/huz-ui-state";

const print_state = () => {
    console.log(JSON.stringify(Store.getState()));
}

Store.dispatch(Action.update("x.y.z", 1));
print_state();

// UPDATE OBJECT
Store.dispatch(Action.update("x", 1));
print_state();

Store.dispatch(Action.update("x.y", 2));
print_state();

Store.dispatch(Action.update("x.y.z", 3));
print_state();

Store.dispatch(Action.update("x.y.z", { t: 4 }));
print_state();

Store.dispatch(Action.update("x.y.z.t", 5));
print_state();

Store.dispatch(Action.update("x.y.z.u", 6));
print_state();

// UPDATE ITEM IN ARRAY
Store.dispatch(Action.update("x.y", [1, 2, 3]));
print_state();

Store.dispatch(Action.update("x.y.[]", 4, item => item === 3));
print_state();

Store.dispatch(Action.update("x.y.[]", { z: 4 }, item => item === 4));
print_state();

Store.dispatch(Action.update("x.y.[]", { z: 5 }, item => item.z === 7));
print_state();

Store.dispatch(Action.update("x.y.[]", { z: 5 }, item => item.z === 4));
print_state();

Store.dispatch(Action.update("x.y.[]", { z: [1, 2, 3, 4, 5] }, item => item.z === 5));
print_state();

Store.dispatch(Action.update("x.y.[].z.[]", 7, [item => item.z, item => item === 5]));
print_state();

Store.dispatch(Action.update("x.y.[].z.[].q", 10, [item => item.z, item => item === 7]));
print_state();

// ADD ITEM TO ARRAY
Store.dispatch(Action.add("x.y.[]", 3));
print_state();

Store.dispatch(Action.add("x.y.[].z.[]", 7, [item => item.z]));
print_state();

// REMOVE FROM ARRAY
Store.dispatch(Action.remove("x.y.[].z.[]", [item => item.z, item => item === 7]));
print_state();

Store.dispatch(Action.remove("x.y.[]", [item => item === 3]));
print_state();

Store.dispatch(Action.remove("x.y.[]", [item => item.z]));
print_state();

Store.dispatch(Action.update("x.y"));
print_state();

Store.dispatch(Action.update("x"));
print_state();

Store.dispatch(Action.clear());
print_state();

console.log(Store.getState());

```
