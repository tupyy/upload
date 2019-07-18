import React from 'react';
import style from './App.module.css';
import FileUIContainer from './components/FileUIContainer/FileUIContainer';
import MainController from "./components/MainController/MainController";
import MainProgressBar from "./components/MainProgressBar/MainProgressBar";
import BottomNavigationComponent from "./components/BottomNavigation/BottomNavigationComponent";

class App extends React.Component {
    render() {
        return (
            <div>
                <div className={style.mainController}>
                    <MainController/>
                </div>
                <div className={style.fileContainer}>
                    <MainProgressBar/>
                    <FileUIContainer/>
                </div>
                <div className={style.bottomComponent}>
                    <BottomNavigationComponent/>
                </div>
            </div>
        );
    }
}


export default App;
