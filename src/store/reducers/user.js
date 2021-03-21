import { AUTH_USER, USER_PROCESSING, USER_TASK_FINISHED, USER_LOGOUT, USER_ERROR } from '../types';

const initialState = {
    user: null,
    loading: true
}

export default function(state = initialState, action) {

    switch (action.type) {

        case AUTH_USER:
            console.log(action.payload);

            return {
                ...state,
                user: action.payload,
                loading: false
            }
        case USER_PROCESSING:
            
            return {
                ...state,
                loading: true
            }
        case USER_TASK_FINISHED:
            
            return {
                ...state,
                loading: false
            }
        case USER_LOGOUT:
            
            return {
                ...initialState
            }
        case USER_ERROR:

            return {
                loading: false, 
                error: action.payload
            }
        default: return state
    }

}