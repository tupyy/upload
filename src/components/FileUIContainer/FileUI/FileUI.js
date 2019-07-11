import Typography from '@material-ui/core/Typography';
import style from './FileUI.module.css';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const React = require('react');

export default class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploading: false,
            completed: 0,

        };
    }

    render() {
        return (
            <div className={style.root}>
                <Paper className={style.paper}>
                    <Grid container spacing={2} className={style.mainGrid}>
                        <Grid item>
                            <div className={style.image}>
                                <img className={style.img} alt="complex" src={this.props.file.blob} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="body2" gutterBottom className={style.filename}>
                                        {this.props.file.name}
                                    </Typography>
                                    <div className={style.progressBar}>
                                        <LinearProgress variant="determinate" value={this.state.completed} />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className={style.buttonContainer}>
                                        <Button variant="contained" color="primary" className={style.button}>
                                            Upload
                                        </Button>
                                        <Button variant="contained" color="secondary" className={style.button}>
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
