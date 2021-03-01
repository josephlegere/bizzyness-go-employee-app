import { GET_ATTENDANCE, ATTENDANCE_ERROR } from '../types'

const initialState = {
    list: [],
    loading: true
}

export default function(state = initialState, action) {

    switch (action.type) {

        case GET_ATTENDANCE:
            return {
                ...state,
                list: action.payload,
                loading: false

            }
        case ATTENDANCE_ERROR:
            return {
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}