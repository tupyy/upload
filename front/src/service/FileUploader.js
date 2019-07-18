import store from '../redux/store';
import {UpdateUploadFileProgress} from "../redux/actions";

function FileUploader(id, filename, fileType, file) {

    this.filename = filename;
    this.fileType = fileType;
    this.file = file;
    this.id = id;
    this.progress = 0;

    // holds the value of the last uploaded chuck.it is used to know how many bytes have been
    // uploaded since the last time
    this.lastUploadedBytesValue = 0;

    //XHR promise
    this.promise = undefined;

    //true if the upload has been aborted
    this.hasBeenAborted = false;

    //XHR object. Set by the send function. Useful when cancelling the upload..
    this.xhr = undefined;

    /**
     * trigger update file progress
     * @param valuePercent progress value in %
     * @param chunkSize number of bytes uploaded since the last event
     * @param rawValue total uploaded bytes
     */
    this.updateUploadProgress = function (valuePercent, chunkSize, rawValue) {
        store.dispatch(UpdateUploadFileProgress(this.id, valuePercent, chunkSize, rawValue));
    };

    /**
     * Create XHR object for make POST requests
     * @param id file id
     * @param url url request
     * @param resolve resolve promise callback
     * @param reject reject promise callback
     * @return {XMLHttpRequest}
     */
    this.createXHRObject = function(id, url, resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        const csrfToken = document.getElementsByName('csrfmiddlewaretoken')
        if (csrfToken[0] !== undefined) {
            xhr.setRequestHeader('X-CSRFToken', csrfToken[0].value);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status === 404) {
                reject({
                    'id': id,
                    'reason': xhr.statusText,
                    'status': xhr.status
                });
            }
        };
        return xhr;
    }
}

/**
 * Chain three promises.
 * - sign the url for s3 upload
 * - upload to s3
 * - call the server to save the file entry to db
 *     
 * @param signAPI
 * @param saveAPI
 * @return {Promise<promise | never>}
 */
FileUploader.prototype.send = function (signAPI, saveAPI) {
    this.promise = new Promise( (resolve, reject) => {
        this.sign(signAPI).then((signedURL) => {
            return signedURL;
        })
        .then(signedURL => {
            const data = JSON.parse(signedURL);
            return this.uploadFile(data.url);
        }).catch((reason) => {
            console.log(reason);
            reject(reason); // catch the abort or error
        })
        .then( () => {
            return this.save(saveAPI);
        }).catch( reason => {
            console.log(reason);
            reject(reason); // catch the abort or error
        })
        .then( () => {
            resolve(this.id);
        })
    });
    return this.promise;
};

FileUploader.prototype.abort = function () {
    this.hasBeenAborted = true;
    this.xhr.abort();
};
/**
 * Start the upload
 * @return promise
 */
FileUploader.prototype.uploadFile = function (signedURL) {
    const self = this;
    return new Promise((resolve, reject) => {
        self.xhr = new XMLHttpRequest();

        self.xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded * 100) / e.total);
                self.updateUploadProgress(progress, e.loaded - self.lastUploadedBytesValue, e.loaded);
                self.lastUploadedBytesValue = e.loaded;
            }
        });

        self.xhr.onreadystatechange = function () {
            if (self.xhr.readyState === 4) {
                // self.updateUploadProgress(100);
                if (self.xhr.status === 200 || self.xhr.status === 204) {
                    resolve(self.id);
                } else {
                    reject({
                        'id': self.id,
                        'reason': self.xhr.statusText,
                        'status': self.xhr.status
                    });
                }
            }
        };

        self.xhr.open('PUT', signedURL, true);
        self.xhr.setRequestHeader('Content-type', this.fileType);
        self.xhr.overrideMimeType(this.fileType);

        self.xhr.send(this.file);
    });
};

FileUploader.prototype.sign = function (signingApi) {
    let self = this;
    return new Promise((resolve, reject) => {
        self.xhr = self.createXHRObject(self.id, signingApi, resolve, reject);
        self.xhr.send(JSON.stringify({
            'filename': self.filename,
            'filetype': self.fileType
        }));
    });
};

FileUploader.prototype.save = function(saveApi) {
    let self = this;
    return new Promise( (resolve, reject) => {
        self.xhr = self.createXHRObject(self.id, saveApi, resolve, reject);
        self.xhr.send(JSON.stringify({
            'filename': self.filename
        }));
    });
};
export default FileUploader;





