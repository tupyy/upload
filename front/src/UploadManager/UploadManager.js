import store from '../redux/store';
import watch from 'redux-watch';
import {UpdateUploadFileProgress} from "../redux/actions";

let lock = false;
function UploadManager() {}

UploadManager.prototype.subscribe = function() {
    // store is THE redux store
    let w = watch(store.getState);
    store.subscribe(w((newState, oldState, objectPath) => {
        if (newState.files.uploadGlobalState === true) {
            this.uploadFile();
        }
    }))
};

UploadManager.prototype.uploadFile = function() {

    if (lock === false) {
        for(let i=0; i<=100; i += 10) {
            setTimeout(() => {
                console.log("Updating progress: " + i);
                store.dispatch(UpdateUploadFileProgress(0, i));
            }, 3000);
        }
        lock = true;
    }
};



export default UploadManager;

