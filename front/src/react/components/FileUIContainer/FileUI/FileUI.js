import Typography from '@material-ui/core/Typography';
import style from './FileUI.module.css';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Chip from '@material-ui/core/Chip';
import LinearProgress from "@material-ui/core/LinearProgress";
import {connect} from "react-redux";
import {CancelUpload, DeleteFile, UploadFile} from "../../../../redux/actions";
import {CANCELLED, DONE, ERROR, READY} from "../../../../redux/uploadStateTypes";

import React from "react";

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    handleDeleteButtonClick(event) {
        if (this.canUpload()) {
            this.props.cancelUpload(this.props.file.id);
        } else {
            this.props.deleteFile(this.props.file.id);
        }
    }

    isDisabled = function () {
      return this.props.uploadState === DONE;
    };

    canUpload = function () {
        return this.props.uploadState !== READY;
    };

    render() {
        return (
            <div className={style.root}>
                <Paper className={style.paper}>
                    <Grid container spacing={2} className={style.mainGrid}>
                        <Grid item>
                            <div className={style.image}>
                                <img className={style.img} alt="complex" src={this.props.file.fileURL}/>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="body2" gutterBottom className={style.filename}>
                                        {this.props.file.name}
                                    </Typography>
                                    <div className={style.progressBar}>
                                        <LinearProgress variant="determinate" value={this.props.completed}/>
                                    </div>
                                    <div className={style.chip}>
                                        <UploadChip uploadState={this.props.uploadState}/>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className={style.buttonContainer}>
                                        <Button variant="contained"
                                                color="primary"
                                                className={style.button}
                                                disabled={this.isDisabled()}
                                                onClick={() => this.props.uploadFile(this.props.file.id)}
                                        >
                                            Upload
                                        </Button>
                                        <Button variant="contained" color="secondary"
                                                className={style.button}
                                                onClick={this.handleDeleteButtonClick}
                                                disabled={this.isDisabled()}
                                        >
                                            {this.canUpload() ? "Stop" : "Delete"}
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

function mapDispacthToProps(dispatch) {
    return {
        deleteFile: (id) => {
            dispatch(DeleteFile(id))
        },
        cancelUpload: (id) => {
            dispatch(CancelUpload(id))
        },
        uploadFile: (id) => {
            dispatch(UploadFile(id))
        }
    }
}

function UploadChip(props) {
    if (props.uploadState === DONE) {
        return <Chip color="primary" style={{backgroundColor: 'green'}} label="Done"/>;
    } else if (props.uploadState === ERROR) {
        return <Chip color="primary" style={{backgroundColor: 'red'}} label="Error"/>;
    } else if (props.uploadState === CANCELLED) {
        return <Chip color="primary" style={{backgroundColor: 'orange'}} label="Cancelled"/>
    }
    return <div/>;
}

export default connect(null, mapDispacthToProps)(FileUI)
