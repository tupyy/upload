import React from 'react';
import './App.css';
import FileUIContainer from './components/FileUIContainer/FileUIContainer';
import MainController from "./components/MainController/MainController";

function App() {
  return (
    <div>
        <MainController uploadStarted={false} stopActionLabel={"Stop"} />
        <FileUIContainer/>
    </div>
  );
}

export default App;
