import React from 'react';
import styles from "./MainController.style";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

class MainController extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.inputRef.current.click();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" onClick={this.handleClick} className={classes.button}>
                    Add
                    <input type="file" name="files[]" ref={this.inputRef} multiple className={classes.input}/>
                </Button>
                <Button variant="contained" color="primary" className={classes.button}>
                    Upload
                </Button>
                <Button variant="contained" color="secondary" disabled={this.props.uploadStarted} className={classes.button}>
                    {this.props.stopActionLabel}
                </Button>
            </div>
        );
    }

}

export default withStyles(styles)(MainController);
