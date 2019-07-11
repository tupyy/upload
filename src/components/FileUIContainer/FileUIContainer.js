import FileUI from './FileUI/FileUI';
const React = require('react');

export default class FileUIContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            files: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let newFiles = Array.from(event.target.files);
        newFiles.forEach( (element, index, array) => {
            const file = element;
            this.setState(prevState => ({
                files: [...prevState.files, {
                    id: prevState.counter + 1,
                    name: file.name,
                    blob: URL.createObjectURL(file)
                }],
                counter: prevState.counter + 1
            }));
        })
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.files.map(file => (
                      <FileUI key={file.id} file={file}/>
                    ))}
                </div>
            </div>
        );
    }
}
