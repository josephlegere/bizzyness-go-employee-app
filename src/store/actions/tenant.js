import { AUTH_TENANT, TENANT_ERROR } from '../types';

import auth from '@react-native-firebase/auth';

export const tenantSignIn = (access) => dispatch => {

        let { email, password } = access;

        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                
                let { uid } = auth().currentUser;// displayName is for testing purposes

                dispatch({
                    type: AUTH_TENANT,
                    payload: { uid }
                });
            })
            .catch ((err) => {

                let error_message = '';

                if (err.code === 'auth/email-already-in-use')
                    error_message = 'That email address is already in use!';

                if (err.code === 'auth/invalid-email')
                    error_message = 'That email address is invalid!';

                dispatch( {
                    type: TENANT_ERROR,
                    payload: error_message
                });

            });

}