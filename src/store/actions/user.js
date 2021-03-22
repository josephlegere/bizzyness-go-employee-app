import { AUTH_USER, USER_PROCESSING, USER_LOGOUT, USER_ERROR, AUTH_TENANT } from '../types';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import * as RootNavigation from '../../plugins/RootNavigation';

export const userSignIn = (access, tenant_source) => async dispatch => {
    
    let { email, password } = access;

    try {

        if (email === '' || email === null || password === '' || password === null || Object.keys(access).length === 0)  throw 'Please complete your credentials!';

        dispatch({
            type: USER_PROCESSING
        });

        console.log(tenant_source);

        let verifyTenant = await firestore().collection('users')
            .where('email', '==', email)
            .where('tenant_group.tenantid', '==', tenant_source)
            .get();

        if (tenant_source && verifyTenant.empty) throw 'This user doesn\'t represent this company!';

        let authenticatedUser = await auth().signInWithEmailAndPassword(email, password);
            
        let { uid } = auth().currentUser; //displayName is for testing purposes

        let doc = await firestore()
            .collection('users')
            .doc(uid)
            .get();

        let _data = doc.data();
        
        let _user = {
            id: `users/${uid}`,
            name: _data.name,
            employee_code: _data.employee_code,
            service_unique: _data.service_unique
        }

        let _tenant = {
            representative: {
                uid,
                name: _data.name
            },
            account: _data.tenant_group.account,
            tenantid: _data.tenant_group.tenantid,
            system_config: _data.tenant_group.system_config,
            daysoff: _data.tenant_group.daysoff
        }
        
        let { id, name, employee_code, service_unique } = _user;
        let _user_commit = { email, uid, name, id };
        let { tenantid } = _tenant;

        if (tenant_source && tenant_source !== tenantid) throw 'This user doesn\'t represent this company!';

        if (employee_code) _user_commit = { ..._user_commit, employee_code };
        if (service_unique) _user_commit = { ..._user_commit, service_unique };

        dispatch({
            type: AUTH_USER,
            payload: _user_commit
        });

        if (!tenant_source) {
            dispatch({
                type: AUTH_TENANT,
                payload: _tenant
            });
        }

    }
    catch (err) {
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

        throw error_message;

    };

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