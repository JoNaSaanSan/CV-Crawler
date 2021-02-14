import { Button, TextField } from '@material-ui/core';
const React = require('react');
require('./HomeComponent.css');

class HeaderComponent extends React.Component {

    // URL of our puppeteer server 
    URL = 'https://pwp.um.ifi.lmu.de/g05/'

    constructor(props) {
        super(props);

        this.state = {
            websiteURL: '',
            textplaceHolder: ''
        }

        // Binds
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    // Handle Submit URL Button
    handleClick = async function () {
        const results = await this.getHtmlText();
        console.log('results are: ', results)
        // Store retrieved text in a state
        this.setState({
            textplaceHolder: results[0].text
        })
    }

    // Sends a request to the Server and appends URL in the correct way
    getHtmlText = async function () {
        let response = await fetch(this.URL + 'retrieveHTMLRaw?url=' + this.state.websiteURL)
        return await response.json()
    }

    // Listens to a change in the Text Field and stores the text in a state
    handleChange(event) {
        event.persist();
        this.setState({
            websiteURL: event.target.value,
        });
    }

    render() {
        return (
            <div className="home-page">
                <div className="home-view">
                    <text id="welcome-text">
                        Welcome to the CV Crawler.
                        To get started please sign in.  </text>
                    <div id="test-urls">
                        <TextField id="website-url" label="Please enter URL of CV!" variant="outlined" onChange={this.handleChange} />
                    </div>
                    <div>
                        <Button variant="contained" color="primary" onClick={this.handleClick}>Retrieve Text</Button>
                    </div>
                    <div>
                        {this.state.textplaceHolder} </div>
                </div>
            </div>


        )
    }
}

export default HeaderComponent;
