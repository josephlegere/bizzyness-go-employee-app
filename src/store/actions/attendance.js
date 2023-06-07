import axios from 'axios';
import moment from 'moment';

import { GET_ATTENDANCE, ATTENDANCE_ERROR } from '../types';
import { BASE_URL, ATTENDANCE_URL, CLIENT_TYPE, ROOT_URL, ATTENDANCE, ATTENDANCE_INS } from '@env';

export const getAttendance = (tenant, user) => async dispatch => {

    try {
        // console.log(tenant, user);

        let { tenantid, system_config } = tenant;
        let { uid } = user;
        let _tenantid = tenantid.split('/')[1];

        // let url = `${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/${_tenantid}/${uid}`;
        // let headers = { 'server-type': system_config.server_type.type }

        // if (user.service_unique) url += `?service_uid=${user.service_unique}`;
        // if (system_config.server_host) headers = { ...headers, 'external-api': system_config.server_host.api, 'server-timezone': system_config.timezone };

        // const res = await axios.get(url, { headers });
        // let { attendance } = res.data.data;
        // console.log('attendance', res.data.data.attendance);

        const attendance_res = await axios.post(`${ROOT_URL}${ATTENDANCE}`, { st: "logged in", dt: "today", ur: user?.service_unique });
        if (!attendance_res?.data) throw 'Error: retrieving attendance';

        const { attendance_list: attendance } = attendance_res.data;
        
        dispatch( {
            type: GET_ATTENDANCE,
            payload: { attendance, daysoff: tenant.daysoff }
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
        
        let { date, timings, special_date } = body;
        let { tenantid, system_config, account } = tenant;
        let { uid, id, name } = user;
        let _tenantid = tenantid.split('/')[1];

        let data_uploaded = {
            uniq: user.service_unique,
            ain: {
                date: moment(date).format('YYYY-MM-DD'),
                timecheck: timings
            }
        }

        let data_updated = {
            status: 'pending',
            date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            timings: []
        }
        timings.forEach(({ in: _in, out, location }) => {
            data_updated.timings.push({ input: `${moment(date).format('YYYY-MM-DD')} ${_in}`, type: 0, place: location });
            data_updated.timings.push({ input: `${moment(date).format('YYYY-MM-DD')} ${out}`, type: 1, place: location });
        });
        
        // let url = `${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/${_tenantid}/${uid}`;
        // let headers = { 'server-type': system_config.server_type.type }

        // if (user.service_unique) data.service_unique = user.service_unique;
        // if (special_date) data.special_date = special_date;
        // if (system_config.server_host) headers = { ...headers, 'external-api': system_config.server_host.api, 'server-timezone': system_config.timezone };

        // const res = await axios.post(url, data, { headers });
        // console.log(res.data);

        const attendance_res = await axios.post(`${ROOT_URL}${ATTENDANCE_INS}`, data_uploaded);
        console.log('attendance_res ', attendance_res?.data);
        
        // console.log(data_updated);
        if (attendance_res && attendance_res?.data && attendance_res?.data?.qrySuccess) {
            dispatch( {
                type: GET_ATTENDANCE,
                payload: { attendance: [data_updated], update: true }
            });
        }
        else throw 'Error: inserting attendance';
        // dispatch( {
        //     type: 'Nothing'
        // });
    }
    catch (error) {
        dispatch( {
            type: ATTENDANCE_ERROR,
            payload: error
        });
    }

}