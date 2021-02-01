import GoogleAuth from './GoogleAuth';
import { Button, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import TagsInput from 'react-tagsinput'
import axios from 'axios';
const React = require('react');
require('./ProfileComponent.css');


class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            name: '',
            keywords: [],
            emailLimit: 5,
            newInfo: true,

            currURL: '',
            currKeywords: [],
            currEmailLimit: 5,
        }

        // Binds
        this.handleChange = this.handleChange.bind(this);
    }

//handles Change of the Slieder field 
handleSliderChange = (event, newValue) => {
    this.setState({ emailLimit : newValue});
};

//handles Change of the Keywords 
handleChange = (keywords) => {
    this.setState({keywords})
};

//handles change of the textfields Name & URL
handleTextfieldChange = (event) => {
        this.setState({
        [event.target.name]:event.target.value
        })
};

//will handle when Download PDF Button is clicked
handleDownload = (event) => {
};

//will handle Request to Delete all the Data from the database
handleDelete = (event) => {
};

//should load the users current settings - not working right yet
componentDidMount= () =>{
    fetch("/getSettings").then(res =>{
        if(res.ok){
            return res.json()
        }
    }).then(jsonRes => this.setState({
        currURL: jsonRes.url,
        currKeywords: jsonRes.keywords,
        currEmailLimit: jsonRes.emailLimit,
        }
    ));
    console.log(this.state);
} 

//sends the Logininfo to the backend (by now without Google Auth)
handleSubmit = (event) =>{
    console.log(this.state);
    event.preventDefault();
    const userLogin = {
        name: this.state.name,
        url: this.state.url
    }
    axios.post('http://localhost:3001/userLogin',userLogin).then(res=>{
        console.log(res.data)
    })
}


//handles when the save Button is being clicked and sends the post request to the server
handleClick = (event) => {
    console.log(this.state);
    event.preventDefault();
    const userSettings = {
        name: this.state.name,
        url: this.state.url,
        keywords: this.state.keywords,
        emailLimit: this.state.emailLimit,
        newInfo: this.state.newInfo
    }
    axios.post('http://localhost:3001/saveSettings', userSettings)

};   

    render() {

        // Value of Slider 
        function valuetext(value) {
            return `${value}`;
        }

        return (
            <div className="profile-page">
                <div className="signup-view">
                    <h1>Sign up to the matching tool!</h1>
                    <div className="signup-box">
                        <GoogleAuth/>
                        <div id="add-name">
                             <TextField id="outlined-basic" label="Your Name" name="name" onChange={this.handleTextfieldChange} variant="outlined" />
                         </div>
                        <div id="add-urls">
                            <TextField id="outlined-basic" onChange={this.handleTextfieldChange} name="url" label="Please enter URL of CV!" variant="outlined" />
                        </div>
                        <div>
                            <Button variant="contained" onClick={this.handleSubmit} color="primary">Submit</Button>
                        </div>
                    </div>
                    <Divider variant="middle" />
                    <div className="settings-box">
                        <h2>Settings</h2>
                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleDownload}>Download my CV as PDF</Button>
                        </div> 
                        <div>
                             Insert Matching Keywords:
                         </div>
                    <div>
                         <TagsInput inputProps={{className: 'react-tagsinput-input',placeholder:'Keywords'}} value={this.state.keywords} onChange={this.handleChange} />
                    </div>                            
                        <div>
                            Maximum E-Mails per day
                        </div>
                        <div>
                            <Slider
                                name="emailLimit"
                                defaultValue={this.state.currEmailLimit}
                                getAriaValueText={valuetext}
                                aria-labelledby="Maximum E-Mails per day"
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                onChangeCommitted={this.handleSliderChange}
                            />
                        </div>
                        <div>
                            <Button variant="contained" onClick={this.handleClick} color="primary">Save</Button>
                        </div>
                            <Divider id="div" variant="middle"/>
                        <div>
                        <div>
                            <span class="label label-default">Delete all my information.</span>
                        </div>
                        <div> 
                            <Button variant="outline-primary" color="primary" onClick={this.handleDelete}>Delete account</Button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => state.partOfState
export default connect(mapStateToProps)(ProfileComponent);
