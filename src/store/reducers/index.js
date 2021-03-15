import { combineReducers } from 'redux';
import userReducer from './users';
import attendanceReducer from './attendance';
import tenantReducer from './tenant';

export default combineReducers({
    usersList: userReducer,
    attendanceList: attendanceReducer,
    tenantData: tenantReducer
});