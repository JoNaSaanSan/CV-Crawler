import { Button, TextField } from '@material-ui/core';
const React = require('react');
require('./CVComponent.css');


class CVComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

        }

    }
    getRandomHeight() {
        var max = 400;
        var min = 150;
        return Math.random() * (max - min) + min;
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      
//style={{marginRight: spacing + 'em'}} 
//style={{backgroundColor: this.getRandomColor()}, {height: this.getRandomHeight() + "px"}

    render() {
        const myStyle = {
            backgroundColor: this.getRandomColor(),
            height: this.getRandomHeight() + "px"
        }
        return (
            <div className="cv_container"  style={myStyle}>
               <h1 className="cv-name">{this.props.name}</h1>
            </div>


        )
    }
}

export default CVComponent;
