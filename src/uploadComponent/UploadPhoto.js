import FileUI from './fileUI/FileUI';
const React = require('react');

export default class UploadPhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            files: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const file = event.target.files[0];
        this.setState(prevState => ({
                files: [...prevState.files, {
                    id: prevState.counter + 1,
                    name: file.name,
                    blob: URL.createObjectURL(file)
                }],
                counter: prevState.counter + 1
        }));
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleChange}/>
                <div>
                    {this.state.files.map(file => (
                      <FileUI key={file.id} file={file}/>
                    ))}
                </div>
            </div>
        );
    }
}
