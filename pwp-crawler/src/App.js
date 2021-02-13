import './App.css';
import HeaderComponent from './components/HeaderComponent';
import HomeProfilesComponent from './components/HomeProfilesComponentNew';
import { Row, Col, Nav } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ProfileComponent from './components/ProfileComponent';
import ContactUsComponent from "./components/ContactUsComponent"

function App() {

  return (
    <main>
      <HeaderComponent />
      <Switch>
        <Route>
          <Nav.Link as={Link} to="/" component={HomeProfilesComponent} exact /></Route>
        <Route>
          <Nav.Link as={Link} to="/profile" component={ProfileComponent} /> </Route>
        <Route>
          <Nav.Link as={Link} to="/contact" component={ContactUsComponent} /></Route>
        <Route>
          <Nav.Link as={Link} to={Error} /> </Route>
      </Switch>
    </main>
  );
}

export default App;
