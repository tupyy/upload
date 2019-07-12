import {ADD_FILE, DELETE_FILE} from "../actionTypes";
let count = 0;

const initialState = {
    files: []
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
                        completed: 0
                    }],
            };
        case DELETE_FILE:
            return deleteFile(state, action.id);
        default:
            return state;
    }
};

function deleteFile(state, id) {
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
