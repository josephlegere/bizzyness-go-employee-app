import axios from 'axios';

import { GET_ATTENDANCE, ATTENDANCE_ERROR } from '../types';
import { BASE_URL, ATTENDANCE_URL, CLIENT_TYPE } from '@env';

export const getAttendance = (tenant, user) => async dispatch => {

    try {
        // console.log(tenant, user);

        let { tenantid, system_config } = tenant;
        let { uid } = user;

        let _tenantid = tenantid.split('/')[1];

        let url = `${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/${_tenantid}/${uid}`;
        console.log(url);

        let headers = {
            server_type: system_config.server_type.type
        }

        if (user.service_unique) url += `?service_uid=${user.service_unique}`;

        if (system_config.server_host) headers = { ...headers, external_api: system_config.server_host.api };

        const res = await axios.get(url, {
            headers
        });
        console.log(res.data);
        
        dispatch( {
            type: GET_ATTENDANCE,
            payload: res.data
        });
    }
    catch (error) {
        dispatch( {
            type: ATTENDANCE_ERROR,
            payload: error
        });
    }

}

export const addAttendance = (body, tenant, user) => async dispatch => {

    try {
        
        let { date, timings } = body;

        let { tenantid, system_config, account } = tenant;
        let { uid, id, name } = user;

        let _tenantid = tenantid.split('/')[1];
        console.log(tenantid);

        let url = `${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/${_tenantid}/${uid}`;

        let data = {
            date,
            employee: {                
                name,
                id,
                account
            },
            timings
        }

        let headers = {
            server_type: system_config.server_type.type
        }

        if (user.service_unique) data = { ...data, service_unique: user.service_unique };

        if (system_config.server_host) headers = { ...headers, external_api: system_config.server_host.api };

        console.log(url);
        console.log(data);

        const res = await axios.post(url, data, {
            headers
        });
        console.log(res.data);
        
        dispatch( {
            type: GET_ATTENDANCE,
            payload: res.data
        });
    }
    catch (error) {
        dispatch( {
            type: ATTENDANCE_ERROR,
            payload: error
        });
    }

}