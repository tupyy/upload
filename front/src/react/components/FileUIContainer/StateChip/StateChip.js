import React from 'react';
import {CANCELLED, DONE, ERROR} from "../../../../redux/uploadStateTypes";
import Chip from "@material-ui/core/Chip";
import style from './StateChip.module.css';

class StateChip extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = { showStateLog: false }
    }

    handleClick() {
        this.setState({
            ...this.state,
            showStateLog: !this.state.showStateLog
        });
    }

    render() {
        if (this.props.uploadState === DONE) {
            return <Chip color="primary" style={{backgroundColor: 'green', fontWeight:'bold'}} label="Done"/>;
        } else if (this.props.uploadState === ERROR) {
            return (
                <div>
                    <Chip color="primary" style={{backgroundColor: 'red', fontWeight:'bold'}} label="Error" onClick={this.handleClick}/>
                    { this.state.showStateLog &&
                        <ul className={style.logContainer}>
                            <li className={style.logReasonEntry}>{ this.props.stateLog.reason }</li>
                            <li className={style.logStatusEntry}>{ this.props.stateLog.status}</li>
                        </ul>
                    }
                </div>
               );
        } else if (this.props.uploadState === CANCELLED) {
            return <Chip color="primary" style={{backgroundColor: 'orange', fontWeight:'bold'}} label="Cancelled"/>
        }
        return <div/>;
    }
}

export default StateChip;
