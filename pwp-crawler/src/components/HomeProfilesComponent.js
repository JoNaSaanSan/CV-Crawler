import { Button, TextField } from '@material-ui/core';
import CVComponent from './CVComponent';
const React = require('react');
require('./HomeProfilesComponent.css');

class HomeProfilesComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        return (
            <div className="home_container">
                <div className = "buttons_container">
                    <button className = "buttons">All Profiles</button>
                    <button className = "buttons">Matched Profiles</button>
               </div>
               <div className = "cv_container">
                   <div className = "cv-row">
                        <div className = "cv-element">
                            <CVComponent name="Max Mustermann"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Susanne Meyer"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Hannes Riegner"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Sabrina Märtz"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Marlin Marvin"/>
                        </div>
                    </div>

                    <div className = "cv-row">
                        <div className = "cv-element">
                            <CVComponent name="Andreas Schmitz"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Anna Huber"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Severin Schrall"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Sabrina Märtz"/>
                        </div>
                        <div className = "cv-element">
                            <CVComponent name="Marlin Marvin"/>
                        </div>
                    </div>
                </div>


            </div>


        )
    }
}

export default HomeProfilesComponent;
