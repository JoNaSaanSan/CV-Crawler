import React, { Component } from 'react'
import "./ProfileComponent.css"
import MailForm from "../mail/client/MailForm"

export class ContactUsComponent extends Component {
    render() {
        return (
            <div className="profile-page">
                {/* <div className="contact-us"> */}
                <MailForm />
                {/* </div> */}
            </div>
        )
    }
}

export default ContactUsComponent
