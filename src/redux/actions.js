import {ADD_FILE, CANCEL_ALL, CANCEL_UPLOAD, CLEAR_ALL, DELETE_FILE, UPLOAD_ALL, UPLOAD_FILE} from "./actionTypes";

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

export const CancelUpload = id => ({
    type: CANCEL_UPLOAD,
    id: id
});

export const UploadFile = id => ({
    type: UPLOAD_FILE,
    id: id
});

export const UploadAll = () => ({
    type: UPLOAD_ALL
});

export const CancelAll = () => ({
    type: CANCEL_ALL
});

export const ClearAll = () => ({
    type: CLEAR_ALL
});