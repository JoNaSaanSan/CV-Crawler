import { Button, TextField } from '@material-ui/core';
import CVComponent from './CVComponent';
import StackGrid from "react-stack-grid";
import profilepic from '../profilepic.png'
const React = require('react');
require('./HomeProfilesComponent.css');

class HomeProfilesComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            names: [],
            currentName: ""
        }
        this.getNamesFromDB = this.getNamesFromDB.bind(this)
        //this.openPopup = this.openPopup.bind(this)
    }

     // Called when window is loaded
    componentDidMount() {
        this.getNamesFromDB();
        console.log("componentdidmount aufgerufen")
    }

    openPopup(i){
        this.setState({currentName: this.state.names[i]})
        this.grid.updateLayout()

        document.querySelector('.bg-modal').style.display = "flex";
        window.scrollTo(0,0)
        //document.body.style.overflow = "hidden";
        //this.getNamesFromDB();
        this.showCards();
    }

    closePopup(){
        document.querySelector('.bg-modal').style.display = "none";
        document.body.style.overflow = "auto";
    }
    
    getNamesFromDB(){
        //console.log("names davor " + this.state.names)
        // GET request
        fetch('http://localhost:3001/getSettings').then(response => {
            return response.json();
          })
          .then(data => {
            console.log("Fetching Names...")
            let tempArr = [];
            // create names list
            for (var i = 0; i < data.length; i++) {
                tempArr.push(data[i].name);
            }
            this.setState({names: tempArr})
            console.log("temp Arrayyyy" + tempArr)
          }).catch(error => {
            console.log(error);
          });
        
        /*
        .then(res =>{
            if(res.ok){
                return res.json()
            }
        }).then(jsonRes => this.setState({
            name: jsonRes.name
            }));
            console.log("names danach " + this.state.names)
            */
    }

    showCards(){
        console.log("showCards")
        return this.state.names.map((object, i) =>
            <div key={i} className = "cv-element" onClick={this.openPopup.bind(this, i)}> <CVComponent name={object}/></div>
        )
        
    }

    render() {
        console.log("render funktion")
        return (
            <div className="home_container">
                <div className = "buttons_container">
                    <button className = "buttons">All Profiles</button>
                    <button className = "buttons">Matched Profiles</button>
               </div>


               <StackGrid columnWidth={350} className="stackgrid" gridRef={grid => this.grid = grid} monitorImagesLoaded = {true}>
                {this.showCards()}
               </StackGrid>

               
               <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />
                        <h1>{this.state.currentName}</h1>
                        <p>max.mustermann@gmail.com</p>
                        <a href="www.google.de">CV Website</a>
                        <hr/>
                        <h3>Keywords</h3>
                    </div>
                </div>

            </div>


        )
    }
}

export default HomeProfilesComponent;
