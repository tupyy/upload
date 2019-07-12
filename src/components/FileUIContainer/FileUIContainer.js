import FileUI from './FileUI/FileUI';
import React from 'react';
import {connect} from "react-redux";

class FileUIContainer extends React.Component {

    render() {
        return (
            <div>
                <div>
                    {this.props.filesState.files && this.props.filesState.files.length
                            ? this.props.filesState.files.map(file => (
                                <FileUI key={file.id} file={file}/>))
                            : "Add some files"
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const filesState = state.files;
    return {filesState};
};

export default connect(mapStateToProps)(FileUIContainer)
