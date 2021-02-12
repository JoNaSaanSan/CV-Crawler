import { Button, TextField } from '@material-ui/core';
const React = require('react');
require('./CVComponent.css');


class CVComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }

    }


    render() {
        //styling of div container
        const myStyle = {
            backgroundColor: this.props.color,
            height: this.props.height + "px"
        }
        return (
            <div className="cv_container"  style={myStyle}>
               <h1 className="cv-name">{this.props.name}</h1>
            </div>
        )
    }
}

export default CVComponent;
