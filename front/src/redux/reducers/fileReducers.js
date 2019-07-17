import {
    ADD_FILE,
    CANCEL_ALL,
    CANCEL_UPLOAD,
    CLEAR_ALL,
    DELETE_FILE,
    UPDATE_FILE_UPLOAD_PROGRESS, UPDATE_FILE_UPLOAD_STATE,
    UPLOAD_ALL,
    UPLOAD_FILE
} from "../actionTypes";
import {CANCELLED, DONE, QUEUED, READY, UPLOADING} from "../uploadStateTypes";
let count = 0;

const initialState = {
    files: [],
    global: {
        uploadGlobalState: false,
        uploadedBytes: 0,
        totalBytes: 0,
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_FILE:
            return {
                ...state,
                files: [...state.files,
                    {
                        id: count++,
                        fileURL: action.fileURL,
                        name: action.name,
                        fileType: action.fileType,
                        file: action.file,
                        completed: 0,
                        uploadState: READY
                    }],
                global: {
                    totalBytes: state.global.totalBytes + action.file.size,
                    uploadedBytes: state.global.uploadedBytes,
                    uploadGlobalState: state.global.uploadGlobalState
                }
            };
        case UPLOAD_FILE:
            return onUploadFile(state, action.id);
        case DELETE_FILE:
            return onDeleteFile(state, action.id);
        case CANCEL_UPLOAD:
            return onCancelUpload(state, action.id);
        case CLEAR_ALL:
            return initialState;
        case UPLOAD_ALL:
            return onUploadAll(state);
        case CANCEL_ALL:
            return onCancelAll(state);
        case UPDATE_FILE_UPLOAD_PROGRESS:
            return onUpdateUploadFileProgress(state, action.id, action.value, action.rawValue);
        case UPDATE_FILE_UPLOAD_STATE:
            return onUpdateFileState(state, action.id, action.uploadState);
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

    new_state.files.forEach((fileEntry, index) => {
        if (fileEntry.id === id) {
            //release the URL
            window.URL.revokeObjectURL(fileEntry.fileURL);
            new_state.files.splice(index, 1);
        }
    });
    // new_state.files = [];
    return new_state;
}

/**
 * Handle for onUploadStateChange action
 * It loops through state and set the uploadStarted to true
 */
function onUploadAll(state) {
    let newState = {};
    Object.assign(newState, state);
    newState.files.forEach((entry) => {
        if (entry.uploadState !== DONE) {
            entry.uploadState = QUEUED;
        }
    });

    newState.global.uploadGlobalState = true;
    return newState;
}

function onCancelAll(state) {
    let newState = {};
    Object.assign(newState, state);
    newState.files.forEach((entry) => {
        if (entry.uploadState !== DONE) {
            entry.uploadState = CANCELLED;
        }
    });

    newState.global.uploadGlobalState = false;
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
            fileEntry.uploadState = CANCELLED;
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(newState);

    return newState;
}

function onUploadFile(state, id) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.uploadState = QUEUED;
            fileEntry.completed = 0;
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(state);

    return newState;
}

/**
 * Update the complete variable in the file store
 * @param state old state
 * @param id id of the file
 * @param value of the upload progress
 * @param rawValue number of bytes uploaded
 * @returns new state
 */
function onUpdateUploadFileProgress(state, id, value, rawValue) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.completed = value;
        }
    });

    newState.global.uploadedBytes += rawValue;

    return newState;
}

function onUpdateFileState(state, id, uploadState) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.uploadState = uploadState;
            if (uploadState === READY) {
                fileEntry.completed = 0;
            }
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(newState);
    return newState;
}

/**
 * Return the global upload state. If there is at least one file which is uploading return true
 * else return false
 * @param state
 * @return {boolean}
 */
function getUploadGlobalState(state) {

    for(let i=0; i<state.files.length; i++) {
        const fileEntry = state.files[i];
        if (fileEntry.uploadState === UPLOADING || fileEntry.uploadState === QUEUED) {
            return true;
        }
    }
    return false;
}
