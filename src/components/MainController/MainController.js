import React from 'react';
import PropTypes from 'prop-types';
import styles from "./MainController.style";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {ADD_FILE} from "../../redux/actionTypes";

class MainController extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" onClick={this.handleClick} className={classes.button}>
                    Add
                    <input type="file" name="files[]" ref={this.inputRef} onChange={this.handleChange} multiple className={classes.input}/>
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

MainController.propTypes = {
    uploadStarted: PropTypes.bool.isRequired,
    stopActionLabel: PropTypes.string.isRequired
};

/**
 * maps dispatch to props
 **/
function mapDispatchToProps(dispatch) {
    return {
        addFile: (file,name)=> { dispatch({type: ADD_FILE,file,name})}
    }
}


export default connect(null,mapDispatchToProps) (withStyles(styles)(MainController));
