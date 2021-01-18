
const React = require('react');
require('./HomeComponent.css');


class HeaderComponent extends React.Component {

    render() {
        return (
            <div className="home-page">
                <div className="home-view">
                    <text id="welcome-text">
                        Welcome to the CV Crawler.
                        To get started please sign in.  </text>
                </div>

            </div>
        )
    }
}

export default HeaderComponent;
