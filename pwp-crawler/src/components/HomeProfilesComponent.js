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
            current: {name: "", email: "", cvURL: "", keywords: ""},
            userInfo: []
        }
        this.getNamesFromDB = this.getNamesFromDB.bind(this)
        //this.openPopup = this.openPopup.bind(this)
    }

     // Called when window is loaded
    componentDidMount() {
        this.getNamesFromDB();
        console.log("componentdidmount aufgerufen")
        console.log("state userInfo" + this.state.userInfo)
    }

    openPopup(i){
        //this.state.current.name = this.state.names[i]
        //this.setState({current: {name: this.state.names[i]}})
        //this.setState({currentName: this.state.names[i]})
        //this.grid.updateLayout()


        this.setState({current:{name: this.state.userInfo[i].name, cvURL: this.state.userInfo[i].cvURL, keywords: this.state.userInfo[i].keywords}})

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
            this.setState({userInfo: data})
            /*
            let tempArr = [];
            // create names list
            for (var i = 0; i < data.length; i++) {
                tempArr.push(data[i].name);
            }
            this.setState({names: tempArr})
            console.log("temp Arrayyyy" + tempArr)
            */
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
        /*
        return this.state.names.map((object, i) =>
            <div key={i} className = "cv-element" onClick={this.openPopup.bind(this, i)}> <CVComponent name={object}/></div>
        )*/
        return this.state.userInfo.map((object, i) =>
            <div key={i} className = "cv-element" onClick={this.openPopup.bind(this, i)}> <CVComponent name={object.name}/></div>
            
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
                {console.log("state userInfo" + JSON.stringify(this.state.userInfo))}

               <StackGrid gutterHeight={2} columnWidth={350} className="stackgrid" gridRef={grid => this.grid = grid} monitorImagesLoaded = {true}>
                {this.showCards()}
               </StackGrid>

               
               <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />
                        <div className= "headline">
                            <h1>{this.state.current.name}</h1>
                        </div>
                            <p>max.mustermann@gmx.de</p>
                        <div className= "headline">
                            <h4>CV Website</h4>
                        </div>  
                        <a href= {this.state.current.cvURL} rel="noreferrer">{this.state.current.cvURL}</a>
                        <hr/>
                        <div className= "headline">
                            <h4>Keywords</h4>
                        </div>
                        <p>{this.state.current.keywords + ""}</p>
                    </div>
                </div>

            </div>


        )
    }
}
//<a href="www.google.de">CV Website</a>
export default HomeProfilesComponent;
