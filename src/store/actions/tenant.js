import { AUTH_TENANT, TENANT_PROCESSING, TENANT_LOGOUT, TENANT_ERROR } from '../types';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const tenantSignIn = (access) => dispatch => {
    
    let { email, password } = access;

    dispatch({
        type: TENANT_PROCESSING
    });

    auth().signInWithEmailAndPassword(email, password)
        .then(async () => {
            
            let { email, uid } = auth().currentUser;// displayName is for testing purposes
            let _details = null;

            await firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then(doc => {
                    let _user = doc.data();
                    
                    _details = {
                        representative: {
                            uid,
                            name: _user.name
                        },
                        account: _user.tenant_group.account,
                        tenantid: _user.tenant_group.tenantid,
                        system_config: _user.tenant_group.system_config
                    }
                })
                .catch(err => {
                    console.log("Error getting documents", err);
                });

            dispatch({
                type: AUTH_TENANT,
                payload: _details
            });
        })
        .catch ((err) => {
            console.error(err);

            let error_message = '';

            if (err.code === 'auth/email-already-in-use')
                error_message = 'That email address is already in use!';

            else if (err.code === 'auth/invalid-email')
                error_message = 'That email address is invalid!';

            else if (err.code === 'auth/wrong-pasword')
                error_message = 'That password is wrong!';

            else
                error_message = `Error during login! ${err}`;

            dispatch( {
                type: TENANT_ERROR,
                payload: error_message
            });

        });

}

export const tenantSignOut = () => async dispatch => {

    dispatch({
        type: TENANT_PROCESSING
    });

    auth().onAuthStateChanged(async (user) => {
        if (user) {
            await auth()
                .signOut();
        }
    });

    dispatch({
        type: TENANT_LOGOUT
    });

}