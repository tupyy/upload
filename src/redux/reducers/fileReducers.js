import {ADD_FILE, CLEAR_ALL, DELETE_FILE, UPLOAD_ALL} from "../actionTypes";
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
                        uploadStarted: false
                    }],
            };
        case DELETE_FILE:
            return onDeleteFile(state, action.id);
        case CLEAR_ALL:
            return initialState;
        case UPLOAD_ALL:
            console.log("upload started");
            break;
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

    new_state.files.forEach((fileEntry,index, array) => {
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
function onUploadStateChange(state, uploadState = false) {

}
