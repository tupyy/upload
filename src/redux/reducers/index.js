import { combineReducers } from 'redux';
import files from './fileReducers';
import controller from './controllerReducers';

export default combineReducers({
    files,
    controller
});
