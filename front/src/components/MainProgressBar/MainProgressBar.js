import React from "react";
import PropTypes from 'prop-types';
import LinearProgress from "@material-ui/core/LinearProgress";
import styles from './MainProgressBar.style';
import withStyles from "@material-ui/core/styles/withStyles";

class MainProgressBar extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={this.props.completed} />
            </div>
        );
    }
}

MainProgressBar.propTypes = {
    completed: PropTypes.number.isRequired
}

export default withStyles(styles)(MainProgressBar);
