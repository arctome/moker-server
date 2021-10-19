import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    user: null
};

function reducer(state, action) {
    if (action.type === 'login') {
        // if (!action.payload) throw new Error("no payload")
        return {
            ...state,
            user: action.data
        };
    }
    if (action.type === 'logout') {
        return {
            ...state,
            user: null
        };
    }

    throw new Error("action type undefined or no action type")
}

const Context = createContext();

function useStore() {
    return useContext(Context);
}

function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
}

export { useStore, StoreProvider };