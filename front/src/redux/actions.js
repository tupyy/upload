import {
    ADD_FILE,
    CANCEL_ALL,
    CANCEL_UPLOAD,
    CLEAR_ALL,
    DELETE_FILE,
    UPDATE_FILE_UPLOAD_PROGRESS,
    UPDATE_FILE_UPLOAD_STATE,
    UPLOAD_ALL,
    UPLOAD_FILE
} from "./actionTypes";

let nextFileID = 0;

export const AddFile = (fileURL, name, fileType, file) => ({
    type: ADD_FILE,
    id: nextFileID++,
    fileURL,
    name,
    fileType,
    file
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

export const UpdateUploadFileProgress = (id, valuePercent, chunkSize, rawValue) => ({
    type: UPDATE_FILE_UPLOAD_PROGRESS,
    id: id,
    value: valuePercent,
    chunkSize: chunkSize,
    rawValue: rawValue
});

export const UpdateUploadState = (id, uploadState, uploadStatePayload) => ({
    type: UPDATE_FILE_UPLOAD_STATE,
    id: id,
    uploadState: uploadState,
    uploadStatePayload: uploadStatePayload
});
