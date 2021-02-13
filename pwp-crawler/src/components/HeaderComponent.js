import { Link } from 'react-router-dom'
import store from '../redux/store';
import logo from '../branding.png';
const React = require('react');
require('./HeaderComponent.css');


store.subscribe(() => store.getState().user.isSignedIn)

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: store.getState().user.isSignedIn,
    }
  }

  render() {

    // Redux: Update Signed in State
    store.subscribe(() => this.setState({ isSignedIn: store.getState().user.isSignedIn }))

    return (
      <div className="header-view">

        
        <img src={logo} id= "logo"/>
        

        <div id="account-view">
          <Link to="/" className="menu-item">
            Home </Link>
          {this.state.isSignedIn ?
            <Link to="/profile" className="menu-item button">
              Profile </Link> : <Link to="/profile" className="menu-item button">
              Log In </Link>}
          <Link to="/contact" className="menu-item">
            Contact Us </Link>

        </div>
      </div>
    )
  }
}

export default HeaderComponent;
