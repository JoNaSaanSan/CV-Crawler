import React, { Component } from 'react'
import "./ProfileComponent.css"
import MailForm from "../mail/MailForm"

export class ContactUsComponent extends Component {
    render() {
        return (
            <div className="profile-page">
                {/* <div className="contact-us"> */}
                <MailForm receiverMailaddress={"cvcrawler@gmail.com"} hallo={"hallo"} />
                {/* </div> */}
            </div>
        )
    }
}

export default ContactUsComponent
