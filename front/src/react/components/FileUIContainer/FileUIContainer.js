import FileUI from './FileUI/FileUI';
import React from 'react';
import {connect} from "react-redux";
import style from './FileUIContainer.module.css';

class FileUIContainer extends React.Component {

    render() {
        return (
            <div>
                <div>
                    {this.props.filesState.files && this.props.filesState.files.length
                            ? this.props.filesState.files.map(file => (
                                <FileUI key={file.id}
                                        file={file}
                                        uploadState={file.uploadState}
                                        completed={file.completed}
                                        showErrorLog={true}
                                />))
                            : <div className={style.noFiles}>
                            <p>Add some images...</p>
                            </div>
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
