import * as TYPE from "./types";
import isFunction from "is-function";
import { empty_array } from "./empty";

const normalizeFinder = (finder) => {
    if (isFunction(finder)) return [finder];
    else if (Array.isArray(finder)) return finder;
    else return empty_array;
}

export default {
    add: (path, value, finder) => ({
        type: TYPE.ADD,
        path,
        value,
        finder: normalizeFinder(finder),
        finderIndex: -1
    }),
    remove: (path, finder) => ({
        type: TYPE.REMOVE,
        path,
        finder: normalizeFinder(finder),
        finderIndex: -1,
    }),
    update: (path, value, finder) => ({
        type: TYPE.UPDATE,
        path,
        value,
        finder: normalizeFinder(finder),
        finderIndex: -1
    }),
    clear: () => ({
        type: TYPE.CLEAR
    }),
}