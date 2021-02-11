import { Button, TextField } from '@material-ui/core';
import CVComponent from './CVComponent';
import StackGrid from "react-stack-grid";
import profilepic from '../profilepic.png'
import MailForm from '../mail/MailForm';
const React = require('react');
require('./HomeProfilesComponent.css');

class HomeProfilesComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
        }
    }

    openPopup() {
        document.querySelector('.bg-modal').style.display = "flex";
        document.body.style.overflow = "";

    }

    openPopup1() {
        document.querySelector('.bg-modalMail').style.display = "flex";
        document.body.style.overflow = "";

    }

    closePopup() {
        document.querySelector('.bg-modal').style.display = "none";
        document.body.style.overflow = "auto";
    }

    closePopup1() {
        document.querySelector('.bg-modalMail').style.display = "none";
        document.body.style.overflow = "auto";
    }


    render() {
        return (
            <div className="home_container">
                <div className="buttons_container">
                    <button className="buttons">All Profiles</button>
                    <button className="buttons">Matched Profiles</button>
                </div>

                <StackGrid columnWidth={350} className="stackgrid">
                    <div key="key1" className="cv-element" onClick={this.openPopup}>
                        <CVComponent firstName="Max Mustermann" />
                    </div>
                    <div key="key2" className="cv-element">
                        <CVComponent firstName="Anja Scherer" />
                    </div>
                    <div key="key3" className="cv-element">
                        <CVComponent firstName="Simon Schmitz" />
                    </div>
                    <div key="key4" className="cv-element">
                        <CVComponent firstName="Anna Huber" />
                    </div>
                    <div key="key5" className="cv-element">
                        <CVComponent firstName="Miriam Schnitz" />
                    </div>
                    <div key="key6" className="cv-element">
                        <CVComponent firstName="Simon Hoffinger" />
                    </div>
                    <div key="key7" className="cv-element">
                        <CVComponent firstName="Thomas Riegner" />
                    </div>
                    <div key="key8" className="cv-element">
                        <CVComponent firstName="Paula Oberacher" />
                    </div>
                    <div key="key9" className="cv-element">
                        <CVComponent firstName="Johannes Niepe" />
                    </div>
                    <div key="key10" className="cv-element">
                        <CVComponent firstName="Andreas Barth" />
                    </div>
                    <div key="key11" className="cv-element">
                        <CVComponent firstName="Veronika Wimmer" />
                    </div>
                    <div key="key12" className="cv-element">
                        <CVComponent firstName="Maximilian Randersdorfer" />
                    </div>
                </StackGrid>

                <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />
                        <h1>Max Mustermann</h1>
                        <p>max.mustermann@gmail.com</p>
                        <a target="_blank" href="http://google.de">CV Website</a>
                        <hr />
                        <h3>Keywords</h3>
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
