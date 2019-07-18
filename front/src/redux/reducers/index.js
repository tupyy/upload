import {combineReducers} from 'redux';
import fileReducer from './fileReducers';

const appReducer = combineReducers({
    files: fileReducer,
});

export default appReducer;
