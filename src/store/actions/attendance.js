import axios from 'axios';

import { GET_ATTENDANCE, ATTENDANCE_ERROR } from '../types';
import { BASE_URL, ATTENDANCE_URL, CLIENT_TYPE } from '@env';

export const getAttendance = () => async dispatch => {

    try {
        console.log('Attendance');
        const res = await axios.get(`${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/HiternQX1hmdvcxnrSIr/wNRypiPjVsbYicDxJipusZQmqSC3?service_uid=2001`, {
            headers: {
                external_api: 'http://gemserve.com.qa/gemserve/gemrest',
                server_type: 'hybrid_lamp_fire'
            }
        });
        // console.log(res.data);
        
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

export const addAttendance = (body) => async dispatch => {

    let { date, timings } = body;

    try {
        console.log('Add Attendance');
        const res = await axios.post(`${BASE_URL}${ATTENDANCE_URL}/${CLIENT_TYPE}/HiternQX1hmdvcxnrSIr/wNRypiPjVsbYicDxJipusZQmqSC3`, {
            date,
            service_uniq: "1866R8U5ac99de43b85c",
            employee: {                
                name: "Edilberto Baslot",
                id: "users/wNRypiPjVsbYicDxJipusZQmqSC3",
                account: "Goodwill Electrical and Mechanical Services"
            },
            timings
        }, {
            headers: {
                external_api: 'http://gemserve.com.qa/gemserve/gemrest',
                server_type: 'hybrid_lamp_fire'
            }
        });
        // console.log(res.data);
        
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