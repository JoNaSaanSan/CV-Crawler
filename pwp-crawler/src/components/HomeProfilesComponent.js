import { Button, TextField } from '@material-ui/core';
import CVComponent from './CVComponent';
import profilepic from '../profilepic.png'
import MailForm from '../mail/MailForm';
const React = require('react');
require('./HomeProfilesComponent.css');

class HomeProfilesComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            userInfo: [], 
            arr0: [], //column 1
            arr1: [], //column 2
            arr2: [], //column 3
            arr3: [], //column 4
            current: {name: "", email: "", cvURL: "", keywords: ""} //data for pop-up
        }
        this.getNamesFromDB = this.getNamesFromDB.bind(this)
    }

     // Called when window is loaded
    componentDidMount() {
        this.getNamesFromDB();
    }

    openPopup(i){
        this.setState({current:{name: this.state.userInfo[i].name, email: this.state.userInfo[i].email, cvURL: this.state.userInfo[i].cvURL, keywords: this.state.userInfo[i].keywords}})
        document.querySelector('.bg-modal').style.display = "flex";
        window.scrollTo(0,0)
        //disable scrolling
        document.body.style.overflow = "hidden";
    }

    openPopup1() {
        document.querySelector('.bg-modalMail').style.display = "flex";
        document.body.style.overflow = "";

    }

    closePopup() {
        document.querySelector('.bg-modal').style.display = "none";
        //enable scrolling
        document.body.style.overflow = "auto";
    }

    
    getNamesFromDB(){
        // GET request
        fetch('http://localhost:3001/getUsers').then(response => {
            return response.json();
          })
          .then(data => {
            this.setState({userInfo: this.allocateColorHeight(data)}, () => this.showMyCards())
          }).catch(error => {
            console.log(error);
          });
        
    }

    allocateColorHeight(data){
        //assign a random card color/height to every user
        // newData = [{keywords: ..., id: ..., name: ..., cvURL: ..., emailLimit: ..., newInfo: ..., color: ..., height: ...}, {...}]
        var newData =[];
        for(var i =0; i< data.length; i++){
            newData.push(Object.assign(data[i], {color: this.getRandomColor(), height: this.getRandomHeight()}))
        }
        return (newData)
    }

    getRandomHeight() {
        var max = 400;
        var min = 150;
        return Math.random() * (max - min) + min;
    }

    getRandomColor() {
        //get random blue/green hues
        var letters = '0123456789ABCDEF';
        var color = '#00';  
        for (var i = 0; i < 4; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    showMyCards(){
        if(this.state.userInfo !== undefined) {
            // scatter users into 4 columns
            var myArrays = [[], [], [], []];
            for (let j = 0; j < Object.keys(this.state.userInfo).length; j++) {
                myArrays[j % 4].push(this.state.userInfo[j]);
            }
        
            this.setState({arr0: myArrays[0], arr1: myArrays[1], arr2: myArrays[2], arr3: myArrays[3]})
        }
    }

    renderCards(myColumnArray, column){
        // fill the 4 columns with the users cards -> CVComponent
        return (myColumnArray.map((object, i) => (
            <div className = "cv-element" onClick={this.openPopup.bind(this, i=i*4+ column)}> <CVComponent name={object.name} color= {object.color} height= {object.height} /></div>
        )))
    }

    closePopup1() {
        document.querySelector('.bg-modalMail').style.display = "none";
        document.body.style.overflow = "auto";
    }


    render() {
        return (
            <div className="home_container">

                <div className = "buttons_container">
                    <button className = "buttons">All Profiles</button>
                    <button className = "buttons">Matched Profiles</button>
               </div>
            

                <div className= "cards_container">
                    <div id = "column1" className="column">{this.renderCards(this.state.arr0, 0)}</div>
                    <div id = "column2" className="column">{this.renderCards(this.state.arr1, 1)}</div>
                    <div id = "column3" className="column">{this.renderCards(this.state.arr2, 2)}</div>
                    <div id = "column4" className="column">{this.renderCards(this.state.arr3, 3)}</div>
                </div>


                <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />

                        <div className= "headline">
                            <h1>{this.state.current.name}</h1>
                        </div>
                            <p className= "text">{this.state.current.email}</p>
                        <div className= "headline">
                            <h4>CV Website</h4>
                        </div>  
                        <a href= {this.state.current.cvURL} rel="noreferrer" className= "text">{this.state.current.cvURL}</a>
                        <hr/>
                        <div className= "headline">
                            <h4>Keywords</h4>
                        </div>
                        <p className= "text">{this.state.current.keywords + ""}</p>
                        <button onClick={this.closePopup, this.openPopup1} > Contact me </button>
                        
                    </div>
                </div>

                <div class="bg-modalMail">
                    <div class="modal-contentsMail">
                        <div class="closeMail" onClick={this.closePopup1}>+</div>
                        <div className="mailform">
                            <MailForm receiverMailaddress={"max.mustermann@gmail.com"} />
                        </div>
                    </div>
                </div>




            </div>


        )
    }
}

export default HomeProfilesComponent;