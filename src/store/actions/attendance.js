import axios from 'axios';

import { GET_ATTENDANCE, ATTENDANCE_ERROR } from '../types';
import { BASE_URL, ATTENDANCE_URL } from '@env';

export const getAttendance = () => async dispatch => {
    console.log(BASE_URL);
    try {
        console.log('Attendance');
        const res = await axios.post(`${BASE_URL}${ATTENDANCE_URL}`, {
            task: "checker",
            tenant: {                
                "email": "josephrlegere@gmail.com",
                "uid": "py6jysM81UZugBhi3GVE2RhccDF3",
                "name": "Joseph Legere",
                "id": "users/py6jysM81UZugBhi3GVE2RhccDF3",
                "account": "Goodwill Electrical and Mechanical Services",
                "tenantid": "tenants/HiternQX1hmdvcxnrSIr",
                "system_config": {
                    "server_type": {
                        "notes": "Combination of legacy system and the new system",
                        "version": "1.5",
                        "type": "hybrid_lamp_fire"
                    },
                    "server_host": {
                        "api": "http://gemserve.com.qa/gemserve/gemrest"
                    }
                }
            }
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