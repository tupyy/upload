import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './react/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";
import UploadService from "./service/UploadService";

const rootElement = document.getElementById("root");
const uploadService = new UploadService();


const render = () => ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, rootElement
);
render();
store.subscribe(render);
uploadService.subscribe();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
