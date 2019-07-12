import Typography from '@material-ui/core/Typography';
import style from './FileUI.module.css';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import {DELETE_FILE} from "../../../redux/actionTypes";
import {connect} from "react-redux";

const React = require('react');

 class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    handleDeleteButtonClick(event) {
        this.props.deleteFile(this.props.file.id);
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
                                        <LinearProgress variant="determinate" value={this.props.file.completed} />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className={style.buttonContainer}>
                                        <Button variant="contained" color="primary" className={style.button}>
                                            Upload
                                        </Button>
                                        <Button variant="contained" color="secondary" className={style.button}
                                                onClick={this.handleDeleteButtonClick}
                                        >
                                            Delete
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
        deleteFile: (id) => {dispatch({type:DELETE_FILE, id:id})}
    }
}

export default connect(null, mapDispacthToProps)(FileUI)
