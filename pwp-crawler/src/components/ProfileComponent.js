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
            emailLimit: 5,
            newInfo: true,

            loggedIn: false,  //Name & CV-URL submitted
            isSignedIn: store.getState().user.isSignedIn, //Google Auth Login 
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
      //  localStorage.setItem(event.target.name, event.target.value);
        
};

//loads the users current settings and input 
componentDidMount = () =>{
    console.log(localStorage);
    const name = localStorage.getItem('Name');
    const url = localStorage.getItem('cvURL');
    var loggedIn = localStorage.getItem('loggedIn');
    var isSignedIn = localStorage.getItem('signedIn');
   //var Keywords = localStorage.getItem('Keywords');
    
        this.setState({
            name: name,
            url: url,
            loggedIn: loggedIn,
            issignedIn: isSignedIn
        })
    console.log(this.state);
}

//handles when Download PDF Button is clicked
handleDownload = (event) => {
    event.preventDefault();
    const downloadCV = {
            name: this.state.name,
            url: this.state.url
        }
    axios.post('http://localhost:3001/downloadCV', downloadCV)
    .then(res=>{ console.log(res.data)})
    .then(alert("Just a moment.."))
    .then(() => axios.get('/fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'myCV.pdf');
      })
};


//handles Request to Delete all the user data from a specific user from the database
handleDelete = (event) => {
    console.log(this.state);
    event.preventDefault();
    const deleteUser = {
        name: this.state.name,
        url: this.state.url
    }
    axios.post('http://localhost:3001/deleteUser', deleteUser).then(res=>{
        console.log(res.data)
        if(res.data.message === "User deleted successfully"){
            alert("Your Account was deleted. If you want to rejoin you need to register again.");
            this.setState({
                loggedIn: false
            })
        }
    })
};


//sends the Registration info to the backend 
handleSubmit = (event) =>{
    console.log(this.state);
    event.preventDefault();
    const userRegistration = {
        name: this.state.name,
        email: this.state.email,
        url: this.state.url
    }
    axios.post('http://localhost:3001/userRegistration',userRegistration).then(res=>{
        console.log(res.data)
        if(res.data.message === "Field empty!"){
            alert("You need to Sign In with Google and fill out the Name and CVURL field!");
        }else{
            if(res.data.message === "User with this name, email or URL already exists!"){
            alert("User with this name, email or URL already exists! Please choose another name.");
            }else{
        if(res.data.message === "User saved successfully"){
            this.setState({
                loggedIn: true
            })
            localStorage.setItem( 'Name', this.state.name );
            localStorage.setItem( 'cvURL', this.state.url);
            localStorage.setItem('loggedIn',this.state.loggedIn);
            localStorage.setItem('signedIn',this.state.isSignedIn);
            console.log(localStorage);
            alert("You are successfully registered!");
        }
    }}})

}

//sends the Login info to the backend 
handleLogin = (event) =>{
    console.log(this.state);
    event.preventDefault();
    const userLogin = {
        name: this.state.name,
        email: this.state.email,
        url: this.state.url
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
            })
            localStorage.setItem( 'Name', this.state.name);
            localStorage.setItem( 'cvURL', this.state.url);
            localStorage.setItem('loggedIn',this.state.loggedIn);
            localStorage.setItem('signedIn',this.state.isSignedIn);
          //  localStorage.setItem('Keywords', this.state.keywords);
          //  localStorage.setItem('emailLimit', this.state.emailLimit);
            console.log(localStorage);
            
        }
    }})

}

handleLogout = () =>{
    localStorage.clear();
    alert('You were successfully logged out!');
    window.location.reload(); // reloads the page so that the login page is being reset
}


//handles when the save Button is being clicked and saves the User settings to the right user 
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
    axios.post('http://localhost:3001/updateSettings', userSettings).then(res=>{ //sends the post-request with the user settings
        console.log(res.data)
        if(res.data.message === "Settings saved successfully"){
            alert("Your Settings were saved successfully!");
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
                    <h1>Sign up to the matching tool!</h1>
                    <div className="signup-box">
                        <GoogleAuth/>
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
                         <TagsInput inputProps={{className: 'react-tagsinput-input',placeholder:'Keywords'}} value={this.state.keywords} onChange={this.handleChange} />
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
                : 
                <div></div>}
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => state.partOfState
export default connect(mapStateToProps)(ProfileComponent);
