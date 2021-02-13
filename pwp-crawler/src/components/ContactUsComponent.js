import React, { Component } from 'react'
import "./ProfileComponent.css"
import MailForm from "../mail/MailForm"

export class ContactUsComponent extends Component {
    render() {
        return (
            <div className="profile-page">
                <MailForm receiverMailaddress={"cvcrawler@gmail.com"} />
            </div>
        )
    }
}

export default ContactUsComponent
