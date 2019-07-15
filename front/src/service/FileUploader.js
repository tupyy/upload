function FileUploader() {

    // Url signed for S3
    this.signedUrl = "";

    // the blob
    this.blob = undefined;
    this.filename = undefined;
    this.id = undefined;
    this.progress = 0;

    //XHR object. Set by the send function. Useful when cancelling the upload..
    this.xhr = undefined;

    //trigger an update upload progress
    this.updateUploadProgress = function(value) {
        this.dispatchEvent(new Event('updateProgress', {id: this.id,value: value}));
    }
}

FileUploader.prototype.constructor = function(id, filename, blob) {
    this.id = id;
    this.blob = new Blob(blob);
    this.filename = filename;
};

/**
 * Start the upload
 * @return promise
 */
FileUploader.prototype.send = function() {
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

        self.xhr.open('PUT', this.signedUrl, true);
        self.xhr.setRequestHeader('Content-type', this.blob.type);
        self.xhr.overrideMimeType(this.blob.type);
        self.xhr.send(this.blob);
    });
    promise.abort = function() {
        this.xhr.abort();
    };
    return promise;
};

export default FileUploader;





