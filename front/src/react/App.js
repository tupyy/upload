import React from 'react';
import './App.css';
import FileUIContainer from './react/components/FileUIContainer/FileUIContainer';
import MainController from "./react/components/MainController/MainController";
import MainProgressBar from "./react/components/MainProgressBar/MainProgressBar";

class App extends React.Component {
    render() {
        return (
            <div>
                <MainController/>
                <MainProgressBar completed={0}/>
                <FileUIContainer/>
            </div>
        );
    }
}


export default App;
