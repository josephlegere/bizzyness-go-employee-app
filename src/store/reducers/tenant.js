import { AUTH_TENANT, TENANT_PROCESSING, TENANT_LOGOUT, TENANT_ERROR } from '../types';

const initialState = {
    tenant: null,
    loading: false
}

export default function(state = initialState, action) {

    switch (action.type) {

        case AUTH_TENANT:
            console.log(action.payload);

            return {
                ...state,
                tenant: action.payload,
                loading: false
            }
        case TENANT_PROCESSING:
            
            return {
                ...state,
                loading: true
            }
        case TENANT_LOGOUT:
            
            return {
                ...initialState
            }
        case TENANT_ERROR:

            return {
                loading: false, 
                error: action.payload 
            }
        default: return state
    }

}