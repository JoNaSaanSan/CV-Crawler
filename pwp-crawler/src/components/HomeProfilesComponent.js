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
        }
    }

    openPopup(){
        document.querySelector('.bg-modal').style.display = "flex";
    }

    closePopup(){
        document.querySelector('.bg-modal').style.display = "none";
    }

    render() {
        return (
            <div className="home_container">
                <div className = "buttons_container">
                    <button className = "buttons">All Profiles</button>
                    <button className = "buttons">Matched Profiles</button>
               </div>
               
               <StackGrid columnWidth={350} className="stackgrid">
                    <div key="key1" className = "cv-element" onClick={this.openPopup}>
                        <CVComponent name="Max Mustermann"/>
                    </div>
                    <div key="key2" className = "cv-element">
                        <CVComponent name="Anja Scherer"/>
                    </div>
                    <div key="key3" className = "cv-element">
                        <CVComponent name="Simon Schmitz"/>
                    </div>
                    <div key="key4" className = "cv-element">
                        <CVComponent name="Anna Huber"/>
                    </div>
                    <div key="key5" className = "cv-element">
                        <CVComponent name="Miriam Schnitz"/>
                    </div>
                    <div key="key6" className = "cv-element">
                        <CVComponent name="Simon Hoffinger"/>
                    </div>
                    <div key="key7" className = "cv-element">
                        <CVComponent name="Thomas Riegner"/>
                    </div>
                    <div key="key8" className = "cv-element">
                        <CVComponent name="Paula Oberacher"/>
                    </div>
                    <div key="key9" className = "cv-element">
                        <CVComponent name="Johannes Niepe"/>
                    </div>
                    <div key="key10" className = "cv-element">
                        <CVComponent name="Andreas Barth"/>
                    </div>
                    <div key="key11" className = "cv-element">
                        <CVComponent name="Veronika Wimmer"/>
                    </div>
                    <div key="key12" className = "cv-element">
                        <CVComponent name="Maximilian Randersdorfer"/>
                    </div>
               </StackGrid>

               <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />
                        <h1>Max Mustermann</h1>
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
