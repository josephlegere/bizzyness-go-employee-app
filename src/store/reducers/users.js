import {GET_USERS, USERS_ERROR} from '../types'

const initialState = {
    list: [],
    loading: true
}

export default function(state = initialState, action) {

    switch (action.type) {

        case GET_USERS:
            return {
                ...state,
                list: action.payload,
                loading: false

            }
        case USERS_ERROR:
            return {
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}