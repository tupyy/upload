import store from '../redux/store';
import watch from 'redux-watch';
import FileUploader from 'FileUploader';


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

    newState.files.forEach(entry => {
        if ( !this.uploadQueue.hasOwnProperty(entry.id) ) {
            if (entry.uploadState === true) {
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
        } else {
            if (this.slots.hasOwnProperty(entry.id) && entry.uploadState === false) {
                //upload started. cancel it
                let fileUploaderPromise = this.slots[entry.id];
                fileUploaderPromise.abort();
            }
        }
    })
};

UploadService.prototype.signUrl = function(signingApi,file) {
    let promise = new Promise( (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", signingApi, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve(xhr.responseText);
            } else if (this.status === 404) {
                reject(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({
            'filename': file.name,
            'filetype': file.file.type
        }));
    });

    promise.then((response) => {
        return response;
    });

    promise.reject((response) => {
        console.log("Error signing file: " + response);
        return null;
    });
};

export default UploadService;

