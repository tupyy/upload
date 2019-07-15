import Typography from '@material-ui/core/Typography';
import style from './FileUI.module.css';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import {connect} from "react-redux";
import {CancelUpload, DeleteFile, UploadFile} from "../../../redux/actions";

const React = require('react');

 class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    handleDeleteButtonClick(event) {
        if (this.props.uploadState) {
            this.props.cancelUpload(this.props.file.id);
        } else {
            this.props.deleteFile(this.props.file.id);
        }
    }

    render() {
        return (
            <div className={style.root}>
                <Paper className={style.paper}>
                    <Grid container spacing={2} className={style.mainGrid}>
                        <Grid item>
                            <div className={style.image}>
                                <img className={style.img} alt="complex" src={this.props.file.file} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="body2" gutterBottom className={style.filename}>
                                        {this.props.file.name}
                                    </Typography>
                                    <div className={style.progressBar}>
                                        <LinearProgress variant="determinate" value={this.props.completed} />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className={style.buttonContainer}>
                                        <Button variant="contained"
                                                color="primary"
                                                className={style.button}
                                                disabled={this.props.uploadState}
                                                onClick={() => this.props.uploadFile(this.props.file.id)}
                                        >
                                            Upload
                                        </Button>
                                        <Button variant="contained" color="secondary" className={style.button}
                                                onClick={this.handleDeleteButtonClick}
                                        >
                                            {this.props.uploadState ? "Stop" : "Delete"}
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
        deleteFile: (id) => {dispatch(DeleteFile(id))},
        cancelUpload: (id) => {dispatch(CancelUpload(id))},
        uploadFile: (id) => {dispatch(UploadFile(id))}
    }
}

export default connect(null, mapDispacthToProps)(FileUI)