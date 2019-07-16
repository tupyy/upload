import store from '../redux/store';
import watch from 'redux-watch';
import FileUploader from './FileUploader';
import {QUEUED, READY} from "../redux/uploadStateTypes";


function UploadService() {

    // it limits the slot size
    this.maxConcurrentUploads = 3;

    // Upload queue
    this.uploadQueue = {};

    /**
     * this holds the file which are currently uploading.
     * It has a maximum of concurrent uploads
     */
    this.slots = {};
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
    return this.slots.length <= this.maxConcurrentUploads;
};

/**
 * Handle for state change event. It loops through files and check if new uploads have been started/cancelled
 * If there is a free slot, it starts the upload immediately else it put a new {@link FileUploader} in the uploading
 * queue
 * @param newState new state
 */
UploadService.prototype.onStateChange = function(newState) {

    newState.files.files.forEach(entry => {
        if ( !this.uploadQueue.hasOwnProperty(entry.id) ) {
            if (entry.uploadState === QUEUED) {
                let fileUploader = new FileUploader(entry.id, entry.name, entry.file);
                if (this.hasFreeSlot()) {
                    // TODO start it and add the promise to slots
                } else {
                    this.uploadQueue[entry.id] = fileUploader;
                }
            } else {
                // upload has only be queued..just remove it from upload queue
                delete this.uploadQueue[entry.id];
            }
        } else  {
            //if the state is ready it means the upload has been cancelled so remove it from the queue
            if (this.slots.hasOwnProperty(entry.id) && entry.uploadState === READY) {
                //upload started. cancel it
                let fileUploaderPromise = this.slots[entry.id];
                fileUploaderPromise.abort();
            }
        }
    })
};



export default UploadService;

