import React from 'react';
import style from './BottomNavigationComponent.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faCloudUploadAlt, faBroom } from '@fortawesome/free-solid-svg-icons'
import {BottomNavigation} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

class BottomNavigationComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <BottomNavigation className={classes.root} showLabels={true}>
                <BottomNavigationAction
                    label="Add images"
                    labelColor="red"
                    className={classes.actionButton}
                    icon={<FontAwesomeIcon icon={faPlusCircle} className={classes.icon}/>} />
                <BottomNavigationAction label="Upload" icon={<FontAwesomeIcon icon={faCloudUploadAlt} className={classes.icon}/>} />
                <BottomNavigationAction label="Clear all" icon={<FontAwesomeIcon icon={faBroom} className={classes.icon}/>} />
            </BottomNavigation>
        );
    }
}

export default (withStyles(style))(BottomNavigationComponent);

