import { AUTH_TENANT, TENANT_ERROR } from '../types';

const initialState = {
    tenant: null,
    loading: true
}

export default function(state = initialState, action) {

    switch (action.type) {

        case AUTH_TENANT:
            let { uid } = action.payload;
            console.log(uid);

            return {
                ...state,
                tenant: uid,
                loading: false

            }
        case TENANT_ERROR:

            return {
                loading: false, 
                error: action.payload 
            }
        default: return state
    }

}