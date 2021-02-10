import GoogleAuth from './GoogleAuth';
import { Button, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import axios from 'axios';
import { saveAs } from 'file-saver';
import store from '../redux/store';
const React = require('react');
require('./ProfileComponent.css');


class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: localStorage.getItem('cvURL') || '',
            name: localStorage.getItem('Name') || '',
            email: store.getState().user.email,
            keywords: [],
            email: '',
            emailLimit: 5,
            newInfo: false,

            loggedIn: false,  //Name & CV-URL submitted
            isSignedIn: store.getState().user.isSignedIn, //Google Auth Login 
        }

        // Binds
        this.handleChange = this.handleChange.bind(this);
    }

    //handles Change of the Slider 
    handleSliderChange = (event, newValue) => {
        this.setState({ emailLimit: newValue });
    };

    //handles Change of the Keywords 
    handleChange = (keywords) => {
        this.setState({ keywords })
    };

    //handles change of the textfields Name & URL
    handleTextfieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };


/**
 * loads the users current settings and input from localstorage
 */
componentDidMount = () =>{
    const name = localStorage.getItem('Name');
    const email = localStorage.getItem('Email');
    const url = localStorage.getItem('cvURL');
    var loggedIn = localStorage.getItem('loggedIn');
    var isSignedIn = localStorage.getItem('signedIn');
    var keywords = localStorage.getItem('Keywords');
    var emailLimit = localStorage.getItem('emailLimit');

        this.setState({ //set state to what is in the local storage
            name: name,
            email: email,
            url: url,
            loggedIn: loggedIn,
            issignedIn: isSignedIn
        })

       if(keywords !== null && emailLimit !== 5){  //if they are not equal to the dafault values
            this.setState({  //set state to what is in the local storage
                keywords: JSON.parse(keywords), 
                emailLimit: emailLimit
            })
        }
    console.log(this.state);
}

/**
 * handles when Download PDF Button is clicked
 */
handleDownload = (event) => {
    event.preventDefault(); //prevent reload
    const downloadCV = {
            name: this.state.name,
            email: this.state.email,
            url: this.state.url
        }
    axios.post('http://localhost:3001/downloadCV', downloadCV) //send POST-request to /downloadCV
    .then(res=>{ console.log(res.data)})
    .then(alert("Just a moment..")) //because this takes longer then you would expect
    .then(() => axios.get('/fetch-pdf', { responseType: 'blob' })) //sends GET-request in order to fetch the actual PDF
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' }); //A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format.
        saveAs(pdfBlob, 'myCV.pdf'); //show save file as dialogue
      })
};


/**
 * handles Request to Delete all the user data from a specific user from the database
 * (called when delete account is clicked)
 */
handleDelete = (event) => {
    event.preventDefault(); //prevent reload
    const deleteUser = {
        name: this.state.name,
        email: this.state.email,
        url: this.state.url
    }
    axios.post('http://localhost:3001/deleteUser', deleteUser).then(res=>{ //send POST-request to /deleteUser
        console.log(res.data)
        if(res.data.message === "User deleted successfully"){ //if success
            alert("Your Account was deleted. If you want to rejoin you need to register again."); //Inform the user about the fact that he deleted his account
            this.setState({
                loggedIn: false //logout 
            })
        }
    })
};


/**
 * sends the Registration request
 * (called when register button is clicked)
 */
handleSubmit = (event) =>{
    console.log(this.state);
    event.preventDefault();
    const userRegistration = {
        name: this.state.name,
        email: this.state.email,
        url: this.state.url,
        newInfo: true
    }
    axios.post('http://localhost:3001/userRegistration',userRegistration).then(res=>{ //send POST-request to /userRegistration
        console.log(res.data)
        if(res.data.message === "Field empty!"){
            alert("You need to Sign In with Google and fill out the Name and CVURL field!");
        }else{
            if(res.data.message === "User with this name, email or URL already exists!"){
            alert("User with this name, email or URL already exists! Please choose another name.");
            }else{
        if(res.data.message === "User saved successfully"){
            this.setState({
                loggedIn: true //login user after successful registration
            })
            localStorage.setItem( 'Name', this.state.name );        //puts all the current data from state into localstorage
            localStorage.setItem('Email', this.state.email);
            localStorage.setItem( 'cvURL', this.state.url);
            localStorage.setItem('loggedIn',this.state.loggedIn);
            localStorage.setItem('signedIn',this.state.isSignedIn);
            console.log(localStorage);
            alert("You are successfully registered!");
        }
    }}})

}

/**
 * sends the login request
 * (called when Login Button is clicked)
 */
handleLogin = (event) =>{
    console.log(this.state);
    event.preventDefault();
    const userLogin = {
        name: this.state.name,
        email: this.state.email,
        url: this.state.url,
        newInfo: false
    }
    axios.post('http://localhost:3001/userLogin',userLogin).then(res=>{
        console.log(res.data)
        if(res.data.message === "Field empty!"){
            alert("You need to Sign In with Google and fill out the Name and CVURL field!");
        }else{ 
            if(res.data.message === "User does not exist!"){
                alert("Please Register before logging in!");
            }
            if(res.data.message === "User exists!"){
            this.setState({
                loggedIn: true
            })
            alert("You are successfully logged in!");
            axios.post('/getUserSettings', userLogin ).then(res =>{ //fetches the current user settings
                console.log(res.data);
                this.setState({keywords: res.data.keywords, emailLimit: res.data.emailLimit});
                localStorage.setItem('Keywords',JSON.stringify(res.data.keywords));
                localStorage.setItem('emailLimit', res.data.emailLimit);
            
            })
            localStorage.setItem( 'Name', this.state.name);
            localStorage.setItem('Email', this.state.email);
            localStorage.setItem( 'cvURL', this.state.url);
            localStorage.setItem('loggedIn',this.state.loggedIn);
            localStorage.setItem('signedIn',this.state.isSignedIn);
            console.log(localStorage);
            
        }
    }})

}

/**
 * handles Logout
 * (called when logout button is clicked)
 */
handleLogout = () =>{
    localStorage.clear(); //clear local storage
    alert('You were successfully logged out!');
    window.location.reload(); // reloads the page so that the login page is being reset
}


/**
 * handles user Settings and sends the request to save them, also fetches them to display them immediately
 *(handles when the save Button is being clicked) 
 */
saveSettings = (event) => {
        console.log(this.state);
        event.preventDefault();
        const userSettings = {
            name: this.state.name,
            email: this.state.email,
            url: this.state.url,
            keywords: this.state.keywords,
            emailLimit: this.state.emailLimit,
            newInfo: true,
        }
        axios.post('http://localhost:3001/updateSettings', userSettings).then(res=>{ //sends the post-request with the user settings to /updateSettings
        console.log(res.data)
        if(res.data.message === "Settings saved successfully"){
            alert("Your Settings were saved successfully!");
            axios.post('/getUserSettings', userSettings ).then(res =>{ //fetches the current user settings
                console.log(res.data);
                this.setState({keywords: res.data.keywords, emailLimit: res.data.emailLimit}); //and saves them to the state
                localStorage.setItem('Keywords',JSON.stringify(res.data.keywords)); //and also to the local storage
                localStorage.setItem('emailLimit', res.data.emailLimit);
            
            })
        }else{
            alert("Please make sure your name and cvURL are right!");
        }
    })
};

    render() {

        // Value of Slider 
        function valuetext(value) {
            return `${value}`;
        }
        // Redux: Update Signed in State
        store.subscribe(() => this.setState({ isSignedIn: store.getState().user.isSignedIn, email: store.getState().user.email }))
  
        return (
            <div className="profile-page">
                <div className="signup-view">
                { this.state.loggedIn && this.state.isSignedIn ?
                    <h1>Welcome to the matching tool!</h1>:
                    <h1>Sign up to the matching tool!</h1>}
                    <div className="signup-box">
                        <GoogleAuth />
                        <div id="add-name">
                             <TextField id="outlined-basic" value={this.state.name} label="Your Name" name="name" onChange={this.handleTextfieldChange} variant="outlined" />
                         </div>
                        <div id="add-urls">
                            <TextField id="outlined-basic" value={this.state.url} onChange={this.handleTextfieldChange} name="url" label="Your CV URL" variant="outlined" />
                        </div>
                        { this.state.loggedIn && this.state.isSignedIn ?
                        <div></div>:
                        <div>
                            <Button variant="contained" onClick={this.handleSubmit} color="primary">Register</Button>
                        </div>
                        }
                        { this.state.loggedIn && this.state.isSignedIn ?
                        <div>
                            <Button variant="contained" onClick={this.handleLogout} color="primary">Logout</Button>
                        </div> :
                        <div>
                        <Button variant="contained" onClick={this.handleLogin} color="primary">Login</Button>
                        </div>
                        }
                    </div>
                    <Divider variant="middle" />
                    {  this.state.loggedIn && this.state.isSignedIn ?
                    <div className="settings-box">
                        <h2>Settings</h2>
                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleDownload}>Download my CV as PDF</Button>
                        </div> 
                        <div>
                             Insert Matching Keywords:
                         </div>
                            <div>
                                <TagsInput inputProps={{ className: 'react-tagsinput-input', placeholder: 'Keywords' }} value={this.state.keywords} onChange={this.handleChange} />
                            </div>
                            <div>
                                Maximum E-Mails per day
                        </div>
                        <div>
                            <Slider
                                name="emailLimit"
                                defaultValue={5}
                                value= {this.state.emailLimit}
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
                                <Button variant="contained" onClick={this.saveSettings} color="primary">Save</Button>
                            </div>
                            <Divider id="div" variant="middle" />
                            <div>
                                <div>
                                    <span class="label label-default">Delete all my information.</span>
                                </div>
                                <div>
                                    <Button variant="outline-primary" color="primary" onClick={this.handleDelete}>Delete account</Button>
                                </div>

                            </div>
                        </div>
                        :
                        <div></div>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => state.partOfState
export default connect(mapStateToProps)(ProfileComponent);
