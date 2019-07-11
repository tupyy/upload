import React from 'react';
// import useStyles from "./MainController.style";
import Button from "@material-ui/core/Button";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));

class MainController extends React.Component {


    render() {
        const classes = useStyles();
        return (
            <div className={useStyles.root}>
                <Button variant="contained" color="primary" className={useStyles.button}>
                    Add
                    <input type="file" name="files[]" multiple onChange={this.handleChange} className={useStyles.input}/>
                </Button>
                <Button variant="contained" color="primary" className={useStyles.button}>
                    Upload
                </Button>
                <Button variant="contained" color="secondary" disabled={this.props.uploadStarted} className={useStyles.button}>
                    {this.props.stopActionLabel}
                </Button>
            </div>
        );
    }

}

export default MainController;
