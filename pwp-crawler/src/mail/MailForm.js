import React, { Component } from 'react'
import "./MailForm.css"
import axios from "axios"


export class MailForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            senderMailaddress: "",
            receiverMailaddress: this.props.receiverMailaddress,
            message: "",
        }

        this.formSubmit = this.formSubmit.bind(this)

    }

    // Setting the first name of the sender
    handleFirstName = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }

    // Setting the last name of the sender
    handleLastName = (e) => {
        this.setState({
            lastName: e.target.value

        })
    }

    // Setting the email address of the sender
    handleSenderMail = (e) => {
        this.setState({
            senderMailaddress: e.target.value

        })
    }

    // Setting the email address of the sender
    handleReceiverMail = (e) => {
        this.setState({
            receiverMailaddress: e.target.value

        })
    }

    // Setting the message of the sender 
    handleMessage = (e) => {
        this.setState({
            message: e.target.value
        })
    }


    // When submitted, the mailform input will be sent to "/contact", there is the
    // mailserver waiting for the data. If the mail was succesfully sended, we will
    // receive a response from the mailserver with the statuscode 200 or an error if not.
    formSubmit(e) {
        e.preventDefault()

        const mailData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            senderMailaddress: this.state.senderMailaddress,
            receiverMailaddress: this.state.receiverMailaddress,
            message: this.state.message
        }

        // Using axios to post the mail data
        axios({
            method: "POST",
            url: "https://pwp.um.ifi.lmu.de/g05/contact",
            data: mailData,
            validateStatus: false
        }).then((response) => {
            this.resetForm()
            console.log(response)
            if (response.status === 200) {
                alert("Your Email has been sent!")
            }
            else
                alert("Your Email has not been sent!")
        }).catch(error => {
            console.log(error)
            alert("Your Email has not been sent, an error occurred!")
        })
    }

    // Resets the mailform after submitting the button. 
    resetForm = () => {
        this.setState({
            firstName: "",
            lastName: "",
            senderMailaddress: "",
            // receiverMailaddress: "",
            message: "",
        })
    }

    render() {
        return (
            <div className="container" >
                <form onSubmit={this.formSubmit}>
                    <div className="singleItem">
                        <label htmlFor="firstName"> First name: </label>
                        <input
                            type="text"
                            name="firstName"
                            className="firstName"
                            placeholder="Your first name"
                            value={this.state.firstName}
                            onChange={this.handleFirstName}
                            required
                        />
                    </div>

                    <div className="singleItem">
                        <label htmlFor="lastName">Last name: </label>
                        <input
                            type="text"
                            name="lastName"
                            className="lastName"
                            placeholder="Your last name"
                            value={this.state.lastName}
                            onChange={this.handleLastName}
                            required
                        />
                    </div>

                    <div className="singleItem">
                        <label htmlFor="email">Email sender:</label>
                        <input
                            type="text"
                            name="email"
                            className="email"
                            placeholder="Your email"
                            value={this.state.senderMailaddress}
                            onChange={this.handleSenderMail}
                            required
                        />
                    </div>

                    <div className="singleItem">
                        <label htmlFor="email">Email receiver:</label>
                        <input
                            type="text"
                            name="email"
                            className="email"
                            placeholder="Target email"
                            value={this.props.receiverMailaddress}
                            onChange={""}
                            required
                        />
                    </div>

                    <div className="textarea singleItem">
                        <label htmlFor="message">
                            Message:
                        </label>
                        <textarea
                            name="message"
                            id=""
                            cols="30"
                            rows="10"
                            placeholder="Your message..."
                            value={this.state.message}
                            onChange={this.handleMessage}
                            required
                        >
                        </textarea>
                    </div>
                    <div className="btndiv">
                        <button className="btn" type="submit" >Send</button>
                    </div>

                </form>
            </div>
        )
    }
}

export default MailForm
