import { combineReducers } from 'redux';
import users from './users';
import attendance from './attendance';

export default combineReducers({
    users,
    attendance
});