import {QUEUED, UPLOADING} from "../uploadStateTypes";

/**
 * Return the global upload state. If there is at least one file which is uploading return true
 * else return false
 * @param state
 * @return {boolean}
 */
export function getUploadGlobalState(state) {

    for (let i = 0; i < state.files.length; i++) {
        const fileEntry = state.files[i];
        if (fileEntry.uploadState === UPLOADING || fileEntry.uploadState === QUEUED) {
            return true;
        }
    }
    return false;
}

/**
 * Count the number of bytes of all files with state {@param uploadState}
 * @param state
 * @param uploadState
 */
export function countBytesByState(state, uploadState) {

    let totalBytes = 0;
    state.files.forEach(fileEntry => {
        if (fileEntry.uploadState === uploadState) {
            totalBytes += fileEntry.bytesUploaded;
        }
    });

    return totalBytes;
}
