import { Button, TextField } from '@material-ui/core';
import CVComponent from './CVComponent';
import StackGrid from "react-stack-grid";
import profilepic from '../profilepic.png'
import MailForm from '../mail/MailForm';
import profilesData from "./profilesData"


const React = require('react');
require('./HomeProfilesComponent.css');

class HomeProfilesComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            eMail: ""
        }
    }

    openPopup(e) {
        document.querySelector('.bg-modal').style.display = "flex";
        document.body.style.overflow = "";
        this.setState({
            firstName: e.firstName,
            lastName: e.lastName,
            eMail: e.eMail
        })

    }

    openPopupMail() {
        document.querySelector('.bg-modalMail').style.display = "flex";
        document.body.style.overflow = "";

    }

    closePopup() {
        document.querySelector('.bg-modal').style.display = "none";
        document.body.style.overflow = "auto";
    }

    closePopupMail() {
        document.querySelector('.bg-modalMail').style.display = "none";
        document.body.style.overflow = "auto";
    }






    render() {

        const profileComponents = profilesData.map((profileData) => (
            <div
                onClick={() => this.openPopup(profileData)}
            >
                <CVComponent profile={profileData} id={profileData.id} />
            </div>
        ));



        // console.log(profilesData)

        return (
            <div className="home_container">
                <div className="buttons_container">
                    <button className="buttons">All Profiles</button>
                    <button className="buttons">Matched Profiles</button>
                    {/* <div>{profileComponents}</div> */}
                </div>

                <StackGrid columnWidth={350}
                    className="stackgrid"
                >
                    <div
                        key={profilesData.id}
                        className="cv-element"
                    // onClick={this.openPopup}
                    >

                        {profileComponents}

                    </div>
                </StackGrid>

                <div class="bg-modal">
                    <div class="modal-contents">
                        <div class="close" onClick={this.closePopup}>+</div>
                        <img className="profile-picture" src={profilepic} />
                        <h1>{this.state.firstName} {this.state.lastName}</h1>
                        <p>{this.state.eMail}</p>
                        <a target="_blank" href="http://google.de">CV Website</a>
                        <hr />
                        <h3>Keywords</h3>
                        <button className="btnContactMe" onClick={this.closePopup, this.openPopupMail} > Contact me </button>
                    </div>
                </div>

                <div class="bg-modalMail">
                    <div class="modal-contentsMail">
                        <div class="closeMail" onClick={this.closePopupMail}>+</div>
                        <div className="mailform">
                            <MailForm receiverMailaddress={this.state.eMail} />
                        </div>
                    </div>
                </div>




            </div>


        )
    }
}

export default HomeProfilesComponent;
