import {ADD_FILE, CANCEL_ALL, CANCEL_UPLOAD, CLEAR_ALL, DELETE_FILE, UPLOAD_ALL} from "../actionTypes";
let count = 0;

const initialState = {
    files: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_FILE:
            return {
                ...state,
                files: [...state.files,
                    {
                        id: count++,
                        file: action.file,
                        name: action.name,
                        completed: 0,
                        uploadState: false
                    }],
            };
        case DELETE_FILE:
            return onDeleteFile(state, action.id);
        case CANCEL_UPLOAD:
            return onCancelUpload(state, action.id);
        case CLEAR_ALL:
            return initialState;
        case UPLOAD_ALL:
            return onUploadStateChange(state, true);
        case CANCEL_ALL:
            return onUploadStateChange(state, false);
        default:
            return state;
    }
};

/**
 * Handle for delete file action
 * @param state
 * @param id fileUI id
 */
function onDeleteFile(state, id) {
    let new_state = {};
    Object.assign(new_state, state);

    new_state.files.forEach((fileEntry,index) => {
        if (fileEntry.id === id) {
            new_state.files.splice(index,1);
        }
    });
    // new_state.files = [];
    return new_state;
}

/**
 * Handle for onUploadStateChange action
 * It loops through state and set the uploadStarted to true
 */
function onUploadStateChange(state, uploadState) {
    let newState = {};
    Object.assign(newState, state);
    newState.files.forEach((entry) => {
        entry.uploadState = uploadState;
    });
    return newState;
}


/**
 * Cancel the upload for a single file
 * @param state
 * @param id file id which upload has been cancelled
 */
function onCancelUpload(state, id) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.uploadState = false;
        }
    });
    // new_state.files = [];
    return newState;
}
