import React, {ReactPropTypes as PropTypes} from 'react';
import styles from "./MainController.style";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {ADD_FILE, CLEAR_ALL, STOP_UPLOAD, UPLOAD_ALL} from "../../redux/actionTypes";

class MainController extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnStopClick = this.handleOnStopClick.bind(this);
    }

    handleClick(event) {
        this.inputRef.current.click();
    }

    handleChange(event) {
        let newFiles = Array.from(event.target.files);
        newFiles.forEach( (element, index, array) => {
            const file = element;
            this.props.addFile(URL.createObjectURL(file), file.name);
        });
        this.inputRef.current.value = "";
    }

    handleOnStopClick(event) {
        if (this.props.uploadAllStarted) {
            this.props.onUploadStop();
        } else {
            this.props.onClearAll();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" onClick={this.handleClick} className={classes.button}>
                    Add
                    <input type="file" name="files[]" ref={this.inputRef} onChange={this.handleChange} multiple className={classes.input}/>
                </Button>
                <Button variant="contained" color="primary"
                        className={classes.button}
                        onClick={this.props.onStartUpload}
                        disabled={this.props.uploadAllStarted || !this.props.canClearAll}
                >
                    Upload
                </Button>
                <Button variant="contained"
                        color="secondary"
                        className={classes.button}
                        disabled={!this.props.canClearAll && !this.props.uploadAllStarted}
                        onClick={this.handleOnStopClick}
                >
                    {this.props.stopActionLabel}
                </Button>
            </div>
        );
    }

}

/**
 * maps dispatch to props
 **/
function mapDispatchToProps(dispatch) {
    return {
        addFile: (file,name)=> { dispatch({type: ADD_FILE,file,name})},
        onStartUpload: () => {dispatch({type:UPLOAD_ALL})},
        onUploadStop: () => dispatch({type:STOP_UPLOAD}),
        onClearAll: () => dispatch({type:CLEAR_ALL})
    }
}

const mapStateToProps = state => {
    return {
        stopActionLabel: state.controller.stopActionLabel,
        uploadAllStarted: state.controller.uploadAllStarted,
        canClearAll: state.files.files.length > 0
    };
};


export default connect(mapStateToProps,mapDispatchToProps) (withStyles(styles)(MainController));
