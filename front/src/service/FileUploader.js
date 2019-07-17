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

    //trigger an update upload progress
    this.updateUploadProgress = function (valuePercent, rawValue) {
        store.dispatch(UpdateUploadFileProgress(this.id, valuePercent, rawValue));
    }
}

/**
 * Chain two promises. The first one sign the s3 url and the second upload the file
 * @param signAPI
 * @return {Promise<promise | never>}
 */
FileUploader.prototype.send = function (signAPI) {
    this.promise = new Promise( (resolve, reject) => {
        this.sign(signAPI).then((signedURL) => {
            return signedURL;
        })
        .then(signedURL => {
            return this.uploadFile(signedURL);
        }).catch(() => {
            reject(this.id); // catch the abort or error
        });
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
                self.updateUploadProgress(progress, e.loaded - self.lastUploadedBytesValue);
                self.lastUploadedBytesValue = e.loaded;
            }
        });

        self.xhr.onreadystatechange = function () {
            if (self.xhr.readyState === 4) {
                // self.updateUploadProgress(100);
                if (self.xhr.status === 200 || self.xhr.status === 204) {
                    resolve(self.id);
                } else {
                    reject(self.id, self.xhr.statusText);
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
    let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", signingApi, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve(xhr.responseText);
            } else if (this.status === 404) {
                reject(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({
            'filename': this.filename,
            'filetype': this.fileType
        }));
    });

    return promise;
};
export default FileUploader;





