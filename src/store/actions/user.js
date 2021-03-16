import { AUTH_USER, USER_PROCESSING, USER_LOGOUT, USER_ERROR } from '../types';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import * as RootNavigation from '../../plugins/RootNavigation';

export const userSignIn = (access, tenant_source) => dispatch => {
    
    let { email, password } = access;

    dispatch({
        type: USER_PROCESSING
    });

    auth().signInWithEmailAndPassword(email, password)
        .then(async () => {
            
            let { email, uid } = auth().currentUser; //displayName is for testing purposes
            let _details = null;

            await firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then(doc => {
                    let _user = doc.data();
                    
                    _details = {
                        id: `users/${uid}`,
                        name: _user.name,
                        employee_code: _user.employee_code,
                        account: _user.tenant_group.account,
                        tenantid: _user.tenant_group.tenantid,
                        system_config: _user.tenant_group.system_config
                    }
                })
                .catch(err => {
                    console.log("Error getting documents", err);
                });
            
            let { id, name, employee_code, account, tenantid, system_config } = _details;
			let toCommit = { email, uid, name, id, account, tenantid, system_config };

            if (tenant_source !== tenantid) throw 'This user doesn\'t represent this company!';

			if (employee_code) toCommit = { ...toCommit, employee_code };

            dispatch({
                type: AUTH_USER,
                payload: toCommit
            });

            RootNavigation.navigate('Home');
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
                type: USER_ERROR,
                payload: error_message
            });

        });

}

export const userSignOut = () => async dispatch => {

    dispatch({
        type: USER_PROCESSING
    });

    await auth()
        .signOut();

    dispatch({
        type: USER_LOGOUT
    });

}