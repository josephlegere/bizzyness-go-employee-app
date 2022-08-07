import { AUTH_USER, USER_PROCESSING, USER_LOGOUT, USER_ERROR, AUTH_TENANT, ATTENDANCE_DEFAULT } from '../types';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signEmailAndPassword = (access, tenant) => async dispatch => {
    
    let { email, password } = access;

    try {

        if (email === '' || email === null || password === '' || password === null || Object.keys(access).length === 0) throw 'Please complete your credentials!';

        dispatch({
            type: USER_PROCESSING
        });

        const { tenantid: tenant_source = null } = tenant || {};
        console.log('tenant_source', tenant_source);

        if (tenant && tenant.hasOwnProperty('employees') && !Object.values(tenant.employees).some(e => e.email === email)) throw 'This user doesn\'t represent this company!';

        await auth().signInWithEmailAndPassword(email, password);
            
        let { uid } = auth().currentUser; //displayName is for testing purposes

        let doc = await firestore()
            .collection('users')
            .doc(uid)
            .get();

        let _data = doc.data();
        let { name, employee_code, service_unique, tenant_group } = _data;
        
        let _user = { email, uid, name, id: `users/${uid}` };

        let employees = {};
        let empSnap = await firestore()
            .collection(`${tenant_group.tenantid}/employees`)
            .get();

        empSnap.forEach(doc => {
            employees[doc.id] = doc.data();
        });

        let { account, tenantid, system_config, daysoff, signin_options } = tenant_group;
        let _tenant = {
            representative: {
                uid,
                name
            },
            account,
            tenantid,
            system_config,
            daysoff,
            signin_options,
            employees
        }

        if (employee_code) _user = { ..._user, employee_code };
        if (service_unique) _user = { ..._user, service_unique };

        dispatch({
            type: AUTH_USER,
            payload: _user
        });

        dispatch({
            type: AUTH_TENANT,
            payload: _tenant
        });

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

export const signEmployeeidAndPassword = (access, tenant_source) => async dispatch => {
    // This is basically signInWithEmailAndPassword, but user doesn't provide the email, instead provides the employee code which retrieves the email from the database.

    try {
    
        let { employeeid, password } = access;

        if (employeeid === '' || employeeid === null || password === '' || password === null || Object.keys(access).length === 0) throw 'Please complete your credentials!';

        dispatch({
            type: USER_PROCESSING
        });

        console.log(tenant_source);

        let loggedUser = await firestore().collection('users')
            .where('employee_code', '==', employeeid)
            .where('tenant_group.tenantid', '==', tenant_source)
            .get();

        if (tenant_source && loggedUser.empty) throw 'This user doesn\'t represent this company!';
        
        let _data;
        loggedUser.forEach(doc => {
            _data = doc.data();
        });

        let { email, name, service_unique, tenant_group } = _data;

        await auth().signInWithEmailAndPassword(email, password); // authenticate and signs in the user in firebase

        let { uid } = auth().currentUser; //displayName is for testing purposes
        let _user = { email, uid, name, id: `users/${uid}`, employee_code: employeeid };

        let { account, tenantid, system_config, daysoff, signin_options } = tenant_group;
        let _tenant = {
            representative: {
                uid,
                name
            },
            account,
            tenantid,
            system_config,
            daysoff,
            signin_options
        };

        if (service_unique) _user = { ..._user, service_unique };

        dispatch({
            type: AUTH_USER,
            payload: _user
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
        type: ATTENDANCE_DEFAULT
    });

    dispatch({
        type: USER_LOGOUT
    });

}