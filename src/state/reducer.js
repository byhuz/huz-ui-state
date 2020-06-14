
import * as TYPE from "./types";
import { empty_object } from "./empty";

let _cache = {};

const get_cached = (state, action) => {
    switch (action.type) {
        case TYPE.UPDATE:
        case TYPE.ADD:
        case TYPE.REMOVE:
            const path = action.path;
            const cached = _cache[path];
            if (!cached) {
                const newCache = {
                    paths: path.split('.')
                };
                _cache[path] = newCache;
                return newCache;
            }
            else return _cache[path];
        default:
            break;
    }
}

// UPDATE
const update_array = (cached, depth, parent, path, action) => {
    const finder = action.finder[++action.finderIndex];
    const isLastNode = cached.paths.length === depth + 1;
    return parent.map(item => {
        if (!finder(item)) return item;
        else if (isLastNode) return action.value;
        else return update_path(cached, depth + 1, item, cached.paths[depth + 1], action)
    })
}
const update_path = (cached, depth, parent, path, action) => {
    if (path === '' || path === '[]') return update_array(cached, depth, parent, path, action);

    if (cached.paths.length === depth + 1) // IS IT LAST NODE ?
        return {
            ...parent,
            [path]: action.value
        }
    else
        return {
            ...parent,
            [path]: update_path(cached, depth + 1, parent[path] || empty_object, cached.paths[depth + 1], action)
        }
}

// ADD
const add_to_array = (cached, depth, parent, path, action) => {
    if (cached.paths.length === depth + 1) // IS IT LAST NODE ?
        return [...parent, action.value];

    const finder = action.finder[++action.finderIndex];
    return parent.map(item => {
        if (!finder(item)) return item;
        else return add_to_path(cached, depth + 1, item, cached.paths[depth + 1], action)
    })
}

const add_to_path = (cached, depth, parent, path, action) => {
    if (path === '' || path === '[]')
        return add_to_array(cached, depth, parent, path, action);
    else
        return {
            ...parent,
            [path]: add_to_path(cached, depth + 1, parent[path], cached.paths[depth + 1], action)
        }
}

// REMOVE
const remove_from_array = (cached, depth, parent, path, action) => {
    const finder = action.finder[++action.finderIndex];

    if (cached.paths.length === depth + 1) // IS IT LAST NODE ?
        return parent.filter(item => !finder(item));

    else return parent.map(item => {
        if (!finder(item)) return item;
        else return remove_from_path(cached, depth + 1, item, cached.paths[depth + 1], action)
    })
}

const remove_from_path = (cached, depth, parent, path, action) => {
    if (path === '' || path === '[]')
        return remove_from_array(cached, depth, parent, path, action);

    return {
        ...parent,
        [path]: remove_from_path(cached, depth + 1, parent[path], cached.paths[depth + 1], action)
    }
}

const common = (state = empty_object, action) => {
    const cached = get_cached(state, action);
    switch (action.type) {
        case TYPE.UPDATE:
            return update_path(cached, 0, state, cached.paths[0], action);
        case TYPE.ADD:
            return add_to_path(cached, 0, state, cached.paths[0], action)
        case TYPE.REMOVE:
            return remove_from_path(cached, 0, state, cached.paths[0], action)
        case TYPE.CLEAR:
            return {};
        default:
            return state;
    }
};

export default (state = {}, action) => {
    return {
        default: common(state['default'], action)
    }
}