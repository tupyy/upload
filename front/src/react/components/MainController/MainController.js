import React from 'react';
import MediaQuery from 'react-responsive';
import {connect} from "react-redux";
import Button from "@material-ui/core/Button";
import {AddFile, CancelAll, ClearAll, UploadAll} from "../../../redux/actions";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBroom, faCloudUploadAlt, faPlusCircle, faStopCircle} from "@fortawesome/free-solid-svg-icons";
import styles from "./MainController.style";
import withStyles from "@material-ui/core/styles/withStyles";
import cssStyle from "./MainController.module.css";

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

    isStopDisabled() {
        return !this.props.hasFiles && !this.props.uploadGlobalState ? cssStyle.disabled : "";
    }

    isUploadDisabled() {
        return this.props.uploadGlobalState || !this.props.hasFiles ? cssStyle.disabled : "";
    }

    getStopIcon() {
        return this.props.uploadGlobalState ? faStopCircle : faBroom;
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <input type="file" name="files[]"
                       ref={this.inputRef}
                       onChange={this.handleChange}
                       multiple className={classes.input}/>
                <MediaQuery minDeviceWidth={1224} device={{ deviceWidth: 1600 }}>
                    <Button variant="contained"
                            color="primary"
                            onClick={this.handleClick}
                            className={classes.button}>
                        Add
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
                </MediaQuery>
                <MediaQuery maxDeviceWidth={1224} device={{ deviceWidth: 1600 }}>
                    <BottomNavigation
                        className={classes.rootBottom}
                        showLabels={true}
                        selectedIndex="1"
                    >
                        <BottomNavigationAction
                            label="Add images"
                            labelColor="red"
                            className={classes.bottomAction}
                            onClick={this.handleClick}
                            icon={<FontAwesomeIcon icon={faPlusCircle} className={classes.icon}/>} />
                        <BottomNavigationAction
                            label="Upload"
                            onClick={this.props.onStartUpload}
                            className={[classes.bottomAction,this.isUploadDisabled()].join(' ')}
                            disabled={this.props.uploadGlobalState || !this.props.hasFiles}
                            icon={<FontAwesomeIcon icon={faCloudUploadAlt} className={classes.icon}/>} />
                        <BottomNavigationAction
                            label={this.props.uploadGlobalState ? "Cancel" : "Clear all"}
                            className={[classes.bottomAction,this.isStopDisabled()].join(' ')}
                            disabled={!this.props.hasFiles && !this.props.uploadGlobalState}
                            onClick={this.handleOnCancelClick}
                            icon={<FontAwesomeIcon icon={this.getStopIcon()} className={classes.icon}/>} />
                    </BottomNavigation>
                </MediaQuery>
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
