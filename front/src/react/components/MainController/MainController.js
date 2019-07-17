import React from 'react';
import styles from "./MainController.style";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {AddFile, CancelAll, ClearAll, UploadAll} from "../../../redux/actions";

class MainController extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnCancelClick = this.handleOnCancelClick.bind(this);
    }

    handleClick(event) {
        this.inputRef.current.click();
    }

    handleChange(event) {
        let newFiles = Array.from(event.target.files);
        newFiles.forEach( (element) => {
            const file = element;
            this.props.onAddFile(URL.createObjectURL(file), file.name, file.type, file);
        });
        this.inputRef.current.value = "";
    }

    handleOnCancelClick(event) {
        if (this.props.uploadGlobalState) {
            this.props.onCancelAllUpload();
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
                        disabled={this.props.uploadGlobalState || !this.props.hasFiles}
                >
                    Upload
                </Button>
                <Button variant="contained"
                        color="secondary"
                        className={classes.button}
                        disabled={!this.props.hasFiles && !this.props.uploadGlobalState}
                        onClick={this.handleOnCancelClick}
                >
                    {this.props.uploadGlobalState ? "Cancel" : "Clear all"}
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
        onAddFile: (fileURL, name, fileType, file)=> { dispatch(AddFile(fileURL,name, fileType, file))},
        onStartUpload: () => {dispatch(UploadAll())},
        onCancelAllUpload: () => dispatch(CancelAll()),
        onClearAll: () => dispatch(ClearAll())
    }
}

const mapStateToProps = state => {
    return {
        uploadGlobalState: state.files.global.uploadGlobalState,
        hasFiles: state.files.files.length > 0
    };
};


export default connect(mapStateToProps,mapDispatchToProps) (withStyles(styles)(MainController));
