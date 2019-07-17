import React from 'react';
import style from './App.module.css';
import FileUIContainer from './components/FileUIContainer/FileUIContainer';
import MainController from "./components/MainController/MainController";
import MainProgressBar from "./components/MainProgressBar/MainProgressBar";

class App extends React.Component {
    render() {
        return (
            <div>
                <MainController/>
                <div className={style.fileContainer}>
                    <MainProgressBar/>
                    <FileUIContainer/>
                </div>
            </div>
        );
    }
}


export default App;
