import store from '../redux/store';
import watch from 'redux-watch';
import FileUploader from './FileUploader';
import {DONE, ERROR, QUEUED, READY, UPLOADING} from "../redux/uploadStateTypes";
import {UpdateUploadState} from "../redux/actions";

const signAPI = "http://localhost:5000/sign-s3";

function UploadService() {

    // it limits the slot size
    this.maxConcurrentUploads = 3;

    /**
     * this holds the number of files which are currently uploading.
     * It has a maximum of concurrent uploads
     */
    this.slots = {};

    this.updateUploadState = function(id, uploadState) {
        store.dispatch(UpdateUploadState(id, uploadState));
    }
}

UploadService.prototype.subscribe = function() {
    // store is THE redux store
    let w = watch(store.getState);
    store.subscribe(w((newState) => {
        this.onStateChange(newState);
    }));
};

/**
 * Return true if there free slots
 * @returns {boolean}
 */
UploadService.prototype.hasFreeSlot = function() {
    return Object.keys(this.slots).length <= this.maxConcurrentUploads;
};

/**
 * Handle for state change event. It loops through files and check if new uploads have been started/cancelled
 * If there is a free slot, it starts the upload immediately else it put a new {@link FileUploader} in the uploading
 * queue
 * @param newState new state
 */
UploadService.prototype.onStateChange = function(newState) {

    newState.files.files.forEach(entry => {
        if (entry.uploadState === QUEUED) {
            if (this.hasFreeSlot() && !this.slots.hasOwnProperty(entry.id)) {
                let fileUploader = new FileUploader(entry.id, entry.name, entry.fileURL, entry.fileType);
                this.slots[entry.id] = fileUploader;

                /**
                 * call send method which return a promise. when the promise is either solved or rejected
                 * update the state of the file
                 */
                this.updateUploadState(entry.id, UPLOADING);
                let promise = fileUploader.send(signAPI);
                promise.then(id => {
                    this.updateUploadState(id, DONE);
                }).catch( (id, reason) => {
                    console.log(reason);
                    this.updateUploadState(id, ERROR);
                })
            }
        } else if (entry.uploadState === READY && this.slots.hasOwnProperty(entry.id)) {
            // the upload for this file has been cancelled. Abort the promise
            const fileUploader = this.slots[entry.id];
            fileUploader.abort();
            delete this.slots[entry.id];
        }
    })
};



export default UploadService;

