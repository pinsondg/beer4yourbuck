import {Dispatch, useState} from "react";

export interface AsyncState<T> {
    state: T,
    error?: any
}

export type AsyncReducer<T, V> = (state: AsyncState<T>, action: V) => Promise<AsyncState<T>>;

export function useAsyncReducer<T, V>(asyncReducer: AsyncReducer<T, any>, initialState: AsyncState<T>): [AsyncState<T>, Dispatch<V>] {
    const [state, setState] = useState(initialState);
    console.log("Use async reducer current state: " + JSON.stringify(state));

    const dispatch: Dispatch<V> = async (action: V) => {
        const result = asyncReducer(state, action);
        try {
            const newState = await result;
            newState.error = undefined;
            setState(newState);
        } catch (e) {
            state.error = e;
            setState(state);
        }
    };
    return [state, dispatch];
}