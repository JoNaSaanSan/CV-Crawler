import GoogleAuth from './GoogleAuth';
import { Button, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import axios from 'axios';
const React = require('react');
require('./ProfileComponent.css');


class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: [],
            getEmail: false,
            emailLimit: 5,
            newInfo: true
        }

        // Binds
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleCheckboxChange = function (event) {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
        console.log(this.state.getEmail);
    };
    
    //handles Change of the Slieder field 
    handleSliderChange = (event, newValue) => {
        this.setState({ emailLimit : newValue});
        console.log(this.state.emailLimit)
    };

    //handles Change of the Keywords - ich glaube das Tag Feld was ich hier eingebunden habe wäre praktischer
    handleChange = (keywords) => {
        this.setState({keywords})
        console.log(this.state.keywords)
    };

    //will handle when Download PDF Button is clicked
    handleDownload = (event) => {
    };

    //will handle Request to Delete all the Data from the database
    handleDelete = (event) => {
    };
    
    //handles when the save Button is being clicked and sends the post request to the server
    handleClick = (event) => {
        console.log(this.state);
        event.preventDefault();
        const userSettings = {
            keywords: this.state.keywords,
            getEmail: this.state.getEmail,
            emailLimit: this.state.emailLimit,
            newInfo: this.state.newInfo
        }
        axios.post('http://localhost:3001/settings', userSettings)

    };   



    render() {
        function valuetext(value) {
            return `${value}°C`;
        }
       
        return (
            <div className="profile-page">
                <div className="signup-view">
                    <h1>Sign up to the matching tool!</h1>
                    <div className="signup-box">
                        <GoogleAuth />

                        <div id="add-urls">
                            <TextField id="outlined-basic" label="Please enter URL of CV!" variant="outlined" />
                        </div>
                        <div>
                            <Button variant="contained" color="primary">Submit</Button>
                        </div>
                    </div>
                    <Divider variant="middle" />
                    <div className="settings-box">
                        <h2>Settings</h2>
                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleDownload}>Download my CV as PDF</Button>
                        </div>
                        <div></div>
                        <div id="keywords-textbox">
                            <TextField
                                id="outlined-multiline-static"
                                label="Keywords"
                                multiline
                                rows={4}
                                defaultValue="Insert Matching Keywords"
                                variant="outlined"
                            />  </div>  
                            <div>
                            Insert Matching Keywords
                            </div>
                            <div>
                            <TagsInput inputProps={{className: 'react-tagsinput-input',placeholder:'Keywords'}} value={this.state.keywords} onChange={this.handleChange} />
                            </div>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.getEmail}
                                        onChange={this.handleCheckboxChange}
                                        name="getEmail"
                                        color="primary"
                                    />
                                }
                                label="Receive successful matches via E-Mail"
                            />
                        </div>
                        <div>
                            Maximum E-Mails per day
                        </div>
                        <div>
                            <Slider
                                name="emailLimit"
                                defaultValue={5}
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
                            <Button variant="contained" color="primary" onClick={this.handleClick} >Save</Button>
                        </div>
                        <div></div>
                        <Divider id="div" variant="middle"/>
                        <div></div>
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
