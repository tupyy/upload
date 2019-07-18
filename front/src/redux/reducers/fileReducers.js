import {CANCELLED, DONE, QUEUED, READY} from "../uploadStateTypes";
import {countBytesByState, getUploadGlobalState} from './utils';

// just a counter of added file. simplifies the life
let count = 0;

const initialState = {
    files: [],
    global: {
        uploadGlobalState: false,
        uploadedBytes: 0,
        totalBytes: 0,
    }
};

function createReducers(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

const fileReducer = createReducers(initialState, {
    ADD_FILE: onAddFile,
    UPLOAD_FILE: onUploadFile,
    DELETE_FILE: onDeleteFile,
    CANCEL_UPLOAD: onCancelUpload,
    UPLOAD_ALL: onUploadAll,
    CANCEL_ALL: onCancelAll,
    UPDATE_FILE_UPLOAD_PROGRESS: onUpdateUploadFileProgress,
    UPDATE_FILE_UPLOAD_STATE: onUpdateFileState,
    CLEAR_ALL: onClearAll
});

function onClearAll() {
    return initialState;
}

/**
 * Handle for delete file action
 */
function onDeleteFile(state, action) {
    let new_state = {};
    Object.assign(new_state, state);

    new_state.files.forEach((fileEntry, index) => {
        if (fileEntry.id === action.id) {
            //release the URL
            window.URL.revokeObjectURL(fileEntry.fileURL);
            new_state.files.splice(index, 1);
        }
    });
    return new_state;
}

/**
 * Add file
 */
function onAddFile(state, action) {
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
                bytesUploaded: 0,
                uploadState: READY
            }],
        global: {
            totalBytes: state.global.totalBytes + action.file.size,
            uploadedBytes: state.global.uploadedBytes,
            uploadGlobalState: state.global.uploadGlobalState
        }
    };
}

/**
 * Handle for onUploadStateChange action
 * It loops through state and set the uploadStarted to QUEUED
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

    newState.global.uploadedBytes -= countBytesByState(newState, CANCELLED);
    newState.global.uploadGlobalState = false;
    return newState;
}


/**
 * Cancel the upload for a single file
 */
function onCancelUpload(state, action) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === action.id) {
            fileEntry.uploadState = CANCELLED;

            // subtract uploaded bytes for this file from the global progress
            newState.global.uploadedBytes -= fileEntry.bytesUploaded;
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(newState);
    return newState;
}

/**
 * Upload file reducer
 */
function onUploadFile(state, action) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === action.id) {
            fileEntry.uploadState = QUEUED;
            fileEntry.completed = 0;
            fileEntry.bytesUploaded = 0;
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(state);

    return newState;
}

/**
 * Update the complete variable in the file store
 * @param state old state
 * @param action
 * @returns new state
 */
function onUpdateUploadFileProgress(state, action) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === action.id) {
            fileEntry.completed = action.value;
            fileEntry.bytesUploaded = action.rawValue;
        }
    });

    newState.global.uploadedBytes += action.chunkSize;

    return newState;
}

function onUpdateFileState(state, action) {
    let newState = {};
    Object.assign(newState, state);

    newState.files.forEach((fileEntry) => {
        if (fileEntry.id === action.id) {
            if (action.uploadState === READY) {
                fileEntry.completed = 0;
                fileEntry.bytesUploaded = 0;
                fileEntry.stateLog = {}
            } else {
                fileEntry.uploadState = action.uploadState;
                if (action.uploadStatePayload !== undefined) {
                    fileEntry.stateLog = action.uploadStatePayload;
                }
            }
        }
    });

    newState.global.uploadGlobalState = getUploadGlobalState(newState);
    return newState;
}

export default fileReducer;
