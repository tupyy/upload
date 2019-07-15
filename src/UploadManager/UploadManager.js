import store from '../redux/store';
import watch from 'redux-watch';
import {CancelAll} from "../redux/actions";
function UploadManager() {

    // store is THE redux store
    let w = watch(store.getState);
    store.subscribe(w((newVal, oldVal, objectPath) => {
        console.log('%s changed from %s to %s', objectPath, oldVal, newVal)
        // admin.name changed from JP to JOE
    }))

}

UploadManager.prototype.cancelAll = function() {
    console.log("cancelling all");
    setTimeout(() => {
        console.log("dispatch");
        store.dispatch(CancelAll());
    }, 5000);
};


export default UploadManager;

