/**
* Load state object from localStorage
* @return {object} - the state from localStorage
*/
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

/**
* Save state from the store to localstorage
* @param {object} state - the store state
*/
export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        //Noop
    }
}