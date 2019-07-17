import store from '../redux/store';
import watch from 'redux-watch';
import FileUploader from './FileUploader';
import {CANCELLED, DONE, ERROR, QUEUED, UPLOADING} from "../redux/uploadStateTypes";
import {UpdateUploadState} from "../redux/actions";

const signAPI = "http://localhost:5000/sign-s3";

function UploadService() {

    // it limits the slot size
    this.maxConcurrentUploads = 1;

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
    let w = watch(store.getState,'files');
    store.subscribe(w((newState) => {
        this.onStateChange(newState);
    }));
};

/**
 * Return true if there free slots
 * @returns {boolean}
 */
UploadService.prototype.hasFreeSlot = function() {
    return Object.keys(this.slots).length < this.maxConcurrentUploads;
};

/**
 * Handle for state change event.
 * When the store has been updated, it checks if there are free slots and if true it starts the upload.
 * @param newState new state
 */
UploadService.prototype.onStateChange = function(newState) {

    newState.files.forEach(entry => {
        if (entry.uploadState === QUEUED && !this.slots.hasOwnProperty(entry.id)) {
            if (this.hasFreeSlot()) {
                let fileUploader = new FileUploader(entry.id, entry.name, entry.fileType, entry.file);
                this.slots[entry.id] = fileUploader;
                console.log(this);
                /**
                 * call send method which return a promise. when the promise is either solved or rejected
                 * update the state of the file
                 */
                this.updateUploadState(entry.id, UPLOADING);
                let promise = fileUploader.send(signAPI);

                promise.then(id => {
                    delete this.slots[id];
                    this.updateUploadState(id, DONE);
                }).catch( (id, reason) => {
                    let newState = this.slots[id].hasBeenAborted === true ? CANCELLED : ERROR;
                    delete this.slots[id];
                    this.updateUploadState(id, newState);
                })
            }
        } else if (entry.uploadState === CANCELLED && this.slots.hasOwnProperty(entry.id)) {
            // the upload for this file has been cancelled. Abort the promise
            console.log("Cancelled");
            const fileUploader = this.slots[entry.id];
            fileUploader.abort();
        }
    })
};



export default UploadService;

