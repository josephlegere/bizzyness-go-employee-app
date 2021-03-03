import { combineReducers } from 'redux';
import userReducer from './users';
import attendanceReducer from './attendance';

export default combineReducers({
    usersList: userReducer,
    attendanceList: attendanceReducer
});