function FileUploader(id, filename, fileURL, fileType) {

    this.fileURL = fileURL;
    this.filename = filename;
    this.fileType = fileType;
    this.id = id;
    this.progress = 0;

    //XHR object. Set by the send function. Useful when cancelling the upload..
    this.xhr = undefined;

    //trigger an update upload progress
    this.updateUploadProgress = function(value) {
        this.dispatchEvent(new Event('updateProgress', {id: this.id,value: value}));
    }
}

FileUploader.prototype.send = function(signAPI) {
    return this.sign(signAPI).then((signedURL) => {
        return this.uploadFile(signedURL);
    });
};
/**
 * Start the upload
 * @return promise
 */
FileUploader.prototype.uploadFile = function(signedURL) {
    const self = this;
    let promise = new Promise((resolve, reject) => {
        self.xhr = new XMLHttpRequest();

        self.xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded * 100) / e.total);
                self.updateUploadProgress(progress);
            }
        }, false);

        self.xhr.onreadystatechange = function () {
            if (self.xhr.readyState === 4) {
                self.updateUploadProgress(100);
                self.uploaded = true;
                if (self.xhr.status === 200 || self.xhr.status === 204) {
                    resolve(self.id);
                } else {
                    reject(self.id);
                }
            }
        };

        self.xhr.open('PUT', signedURL, true);
        self.xhr.setRequestHeader('Content-type', this.blob.type);
        self.xhr.overrideMimeType(this.blob.type);
        self.xhr.send(this.blob);
    });
    promise.abort = function() {
        this.xhr.abort();
    };
    return promise;
};

FileUploader.prototype.sign = function(signingApi) {
    let promise = new Promise( (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", signingApi, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
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





