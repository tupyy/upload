import {ADD_FILE, DELETE_FILE} from "./actionTypes";

let nextFileID = 0;

export const AddFile = (file,name) => ({
    type: ADD_FILE,
    id: nextFileID++,
    file,
    name
});

export const DeleteFile = id => ({
    type: DELETE_FILE,
    id: id
});
