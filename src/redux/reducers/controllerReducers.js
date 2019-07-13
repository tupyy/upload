import {UPLOAD_ALL} from "../actionTypes";

const initialState = {
    stopActionLabel: "Clear all",
    uploadAllStarted: false
};

const mainController =  (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_ALL:
            return Object.assign({}, state, {
                stopActionLabel: "Stop",
                uploadAllStarted: true
            });
        default:
            return state;
    }
};

export default mainController;