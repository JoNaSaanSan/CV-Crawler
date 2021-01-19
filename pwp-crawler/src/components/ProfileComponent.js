import GoogleAuth from './GoogleAuth';
import { Button, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
const React = require('react');
require('./ProfileComponent.css');


class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedB: false,
        }

        // Binds
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    // Handles state of checkbox 
    handleCheckboxChange = function (event) {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checkedB}
                                        onChange={this.handleCheckboxChange}
                                        name="checkedB"
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
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                aria-labelledby="Maximum E-Mails per day"
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div>
                            <Button variant="contained" color="primary">Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => state.partOfState
export default connect(mapStateToProps)(ProfileComponent);
