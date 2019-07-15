function FileUploader() {

    // Url signed for S3
    let signedUrl = "";

    // the blob
    let blob = undefined;
    let filename = undefined;
    let id = undefined;
    let progress = 0;

    //XHR object. Set by the send function. Useful when cancelling the upload..
    let xhr = undefined;

    //trigger an update upload progress
    let updateUploadProgress = function(value) {
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
 * @param signedUrl the url requested by S3 to allow POST request
 * @return promise
 */
FileUploader.prototype.send = function(signedUrl) {
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

        self.xhr.open('PUT', signedUrl, true);
        self.xhr.setRequestHeader('Content-type', this.blob.type);
        self.xhr.overrideMimeType(this.blob.type);
        self.xhr.send(this.blob);
    });
    promise.abort = function() {
        this.xhr.abort();
    };
    return promise;
};






