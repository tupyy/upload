import React from 'react';
import './App.css';
import FileUIContainer from './components/FileUIContainer/FileUIContainer';
import MainController from "./components/MainController/MainController";
import MainProgressBar from "./components/MainProgressBar/MainProgressBar";

function App() {
  return (
    <div>
        <MainController uploadStarted={false} stopActionLabel={"Stop"} />
        <MainProgressBar completed={0}/>
        <FileUIContainer/>
    </div>
  );
}


export default App;
