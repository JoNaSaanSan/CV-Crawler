
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { authenticateUser } from '../redux/action'
import React from 'react';
import store from '../redux/store';


const CLIENT_ID =
    '914272458440-vsme6l876vvcifkqs1fof4j74730k5nr.apps.googleusercontent.com';

// REDUX AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
    return {
        authenticateUser: user => dispatch(authenticateUser(user))
    };
}

//SUBSCRIBE the state change
store.subscribe(() => {
    console.log("Sub" + store.getState().user.isSignedIn);
});



class GoogleAuth extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            isSignedIn: false,
        }

        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }

    // Handle Login
    login(response) {
        console.log(response)
        if (response.accessToken) {
            this.props.authenticateUser({ name: response.profileObj.name, accessToken: response.accessToken, isSignedIn: true })
        }
    }



    // Handle Log out
    logout(response) {
        this.props.authenticateUser({ name: '', accessToken: '', isSignedIn: false })
    }

    handleLoginFailure(response) {
        //alert('Log in failed! Please try again')
    }

    handleLogoutFailure(response) {
      //  alert('Log out failed! Please try again')
    }


    render() {

        store.subscribe(() => this.setState({ isSignedIn: store.getState().user.isSignedIn }))

        return (
            <div>
                {  this.state.isSignedIn ?
                    <GoogleLogout
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <Button variant="outlined" color="primary" onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign out</Button>
                        )}
                        buttonText='Logout'
                        onLogoutSuccess={this.logout}
                        onFailure={this.handleLogoutFailure}
                    >
                    </GoogleLogout> : <GoogleLogin
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <Button variant="outlined" color="primary" onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign In with Google</Button>
                        )}
                        onSuccess={this.login}
                        onFailure={this.handleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        responseType='code,token'
                    />
                }
            </div>
        )
    }
}




export default connect(null, mapDispatchToProps)(GoogleAuth);