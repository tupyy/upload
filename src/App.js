import React from 'react';
import './App.css';
import FileUIContainer from './components/FileUIContainer/FileUIContainer';
import MainController from "./components/MainController/MainController";
import MainProgressBar from "./components/MainProgressBar/MainProgressBar";
import UploadManager from "./components/uploadManager/UploadManager";

function App() {
    return (
        <div>
            <MainController/>
            <MainProgressBar completed={0}/>
            <FileUIContainer/>
        </div>
    );
}


export default App;
