import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import styles from './MainProgressBar.style';
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";

class MainProgressBar extends React.Component {

    computeProgress = function () {
        if (this.props.uploadGlobalState === false) {
            return 0;
        }

        if (this.props.uploadedBytes === 0 || this.props.totalBytes === 0) {
            return 0;
        }
        return Math.round((this.props.uploadedBytes * 100) / this.props.totalBytes)
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={this.computeProgress()}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const uploadGlobalState = state.files.global.uploadGlobalState;
    const uploadedBytes = state.files.global.uploadedBytes;
    const totalBytes = state.files.global.totalBytes;
    return {
        uploadGlobalState,
        uploadedBytes,
        totalBytes
    }

};

export default connect(mapStateToProps)(withStyles(styles)(MainProgressBar));
