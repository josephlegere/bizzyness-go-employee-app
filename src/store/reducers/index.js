import { combineReducers } from 'redux';
import attendanceReducer from './attendance';
import tenantReducer from './tenant';
import userReducer from './user';

export default combineReducers({
    attendanceList: attendanceReducer,
    tenantData: tenantReducer,
    userData: userReducer
});