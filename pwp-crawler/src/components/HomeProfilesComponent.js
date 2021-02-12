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
            current: {name: "", email: "", cvURL: "", keywords: ""},
            userInfo: [],
            arr0: [],
            arr1: [],
            arr2: [],
            arr3: []
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
        this.setState({current:{name: this.state.userInfo[i].name, cvURL: this.state.userInfo[i].cvURL, keywords: this.state.userInfo[i].keywords}})

        document.querySelector('.bg-modal').style.display = "flex";
        window.scrollTo(0,0)
        document.body.style.overflow = "hidden";
        //this.getNamesFromDB();
        //this.showCards();
    }

    closePopup(){
        document.querySelector('.bg-modal').style.display = "none";
        document.body.style.overflow = "auto";
    }
    
    getNamesFromDB(){
        // GET request
        fetch('http://localhost:3001/getSettings').then(response => {
            return response.json();
          })
          .then(data => {
            console.log("Fetching Names...")
            this.setState({userInfo: this.allocateColorHeight(data)}, () => this.showMyCards())
            
          }).catch(error => {
            console.log(error);
          });
        
    }

    allocateColorHeight(data){
        var newData =[];
        for(var i =0; i< data.length; i++){
            newData.push(Object.assign(data[i], {color: this.getRandomColor(), height: this.getRandomHeight()}))
        }
        console.log(newData)
        return (newData)
    }

    getRandomHeight() {
        var max = 400;
        var min = 150;
        return Math.random() * (max - min) + min;
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#00';
        for (var i = 0; i < 4; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    renderCards(myColumnArray, column){
        return (myColumnArray.map((object, i) => (
            <div className = "cv-element" onClick={this.openPopup.bind(this, i=i*4+ column)}> <CVComponent name={object.name} color= {object.color} height= {object.height} /></div>
        )))
    }

    showMyCards(){
        if(this.state.userInfo !== undefined) {
            var myArrays = [[], [], [], []];
        
            for (let j = 0; j < Object.keys(this.state.userInfo).length; j++) {
                myArrays[j % 4].push(this.state.userInfo[j]);
            }

            this.setState({arr0: myArrays[0], arr1: myArrays[1], arr2: myArrays[2], arr3: myArrays[3]})

            console.log(myArrays)
            console.log("arr0" + this.state.arr0)
       
    }}

    render() {
        console.log("render funktion")
        return (
            <div className="home_container">
                <div className = "buttons_container">
                    <button className = "buttons">All Profiles</button>
                    <button className = "buttons">Matched Profiles</button>
               </div>
            
               
               <StackGrid gutterHeight={2} columnWidth={350} className="stackgrid" gridRef={grid => this.grid = grid} monitorImagesLoaded = {true}>
                </StackGrid>

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

export default HomeProfilesComponent;
// {console.log("state userInfo" + JSON.stringify(this.state.userInfo))}
//<a href="www.google.de">CV Website</a>
/*const newP = document.createElement('div');
            newP.setAttribute("key", i);
            newP.setAttribute("className", "cv-element");
            newP.setAttribute("id", "container");

            const cvComp = document.createElement('CVComponent', { is : "Peter" })
            cvComp.name= "Peter"*/
                /*
        for(var i= 0; i< Object.keys(this.state.userInfo).length; i++){
            
        }*/
           // newP.setAttribute("key", i);


//OPEN POPUP
           //this.state.current.name = this.state.names[i]
        //this.setState({current: {name: this.state.names[i]}})
        //this.setState({currentName: this.state.names[i]})
        //this.grid.updateLayout()


//GETNAMESFROMDB
    //console.log("names davor " + this.state.names)
    /*
            let tempArr = [];
            // create names list
            for (var i = 0; i < data.length; i++) {
                tempArr.push(data[i].name);
            }
            this.setState({names: tempArr})
            console.log("temp Arrayyyy" + tempArr)
            */


//SHOWCARDS
/*
        return this.state.names.map((object, i) =>
            <div key={i} className = "cv-element" onClick={this.openPopup.bind(this, i)}> <CVComponent name={object}/></div>
        )*/


//SHOWMYCARDS
//var arraysT= [{column: ["column1_1", "column1_2"]}, {column: ["column2_1", "column2_2"]}, {column: ["column3_1", "column3_2"]}, {column: ["column4_1", "column4_2"]}]
        /*var arrays= [{column: ["test"]}, {column: []}, {column: []}, {column: []}]

        for(var j = 0; j < arrays.length; j++){
            for(var i= 0; i< Object.keys(this.state.userInfo).length; i++){
                arrays[j].column.push(this.state.userInfo[i].name)
            }
        }*/

         /*
        for(var i= 0; i< Object.keys(this.state.userInfo).length; i++){
            for(var j = 0; j < arrays.length; j++){

                arrays[j];
            }
            document.getElementById('column1').appendChild(this.showCards(this.state.userInfo[i],i));
            //document.getElementById('container').appendChild(cvComp);

            
            console.log("showmycards!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            
        }*/
/*
        return(<div>
            {//for(let i = 0; i < myArrays[0].length; i++){}
                myArrays[0].map((object, i) =>{
                this.showCards(object, i*4)
                console.log(object)})
                
                //return(<div key={i*4} className = "cv-element" onClick={this.openPopup.bind(this, i*4)}> <CVComponent name={myArrays[0][i]}/></div>)
            }<div>tester</div></div>)*/