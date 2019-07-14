import {UPLOAD_ALL} from "../actionTypes";

const initialState = {
    stopActionLabel: "Clear all",
    uploadState: false
};

const mainController =  (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_ALL:
            return Object.assign({}, state, {
                stopActionLabel: "Cancel",
                uploadState: true
            });
        default:
            return state;
    }
};

export default mainController;