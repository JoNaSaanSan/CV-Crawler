import { LOGIN_USER } from './action';
const initialState = {
    user: {name: '', usertoken: '', isSignedIn: false }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

export default rootReducer;