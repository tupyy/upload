import {
    ADD_FILE,
    CANCEL_ALL,
    CANCEL_UPLOAD,
    CLEAR_ALL,
    DELETE_FILE,
    UPDATE_FILE_UPLOAD_PROGRESS,
    UPLOAD_ALL,
    UPLOAD_FILE
} from "../actionTypes";
import {QUEUED, READY} from "../uploadStateTypes";
let count = 0;

const initialState = {
    files: [],
    uploadGlobalState: false
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
                        completed: 0,
                        uploadState: READY
                    }]
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
            return onUploadStateChange(state, true);
        case CANCEL_ALL:
            return onUploadStateChange(state, false);
        case UPDATE_FILE_UPLOAD_PROGRESS:
            return onUpdateUploadFileProgress(state, action.id, action.value);
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
function onUploadStateChange(state, uploadState) {
    let newState = {};
    Object.assign(newState, state);
    newState.files.forEach((entry) => {
        entry.uploadState = uploadState;
    });
    newState.uploadGlobalState = uploadState;
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
            fileEntry.uploadState = READY;
        }
    });

    if (countUploadingFiles(newState) === 0) {
        newState.uploadGlobalState = false;
    }
    return newState;
}

function countUploadingFiles(state) {

    let countUploadingFiles = 0;
    state.files.forEach((fileEntry) => {
        if (fileEntry.uploadState === true) {
            countUploadingFiles++;
        }
    });
    return countUploadingFiles;
}

function onUploadFile(state, id) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.uploadState = QUEUED;
        }
    });

    newState.uploadGlobalState = true;

    return newState;
}

/**
 * Update the complete variable in the file store
 * @param state old state
 * @param id id of the file
 * @param value of the upload progress
 * @returns new state
 */
function onUpdateUploadFileProgress(state, id, value) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === id) {
            fileEntry.completed = value;
        }
    });

    newState.uploadGlobalState = true;

    return newState;
}
