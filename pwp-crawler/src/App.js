import './App.css';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import HomeProfilesComponent from './components/HomeProfilesComponent';
import { Route, Switch } from 'react-router-dom';
import ProfileComponent from './components/ProfileComponent';

function App() {
  
  return (
    <main>
      <HeaderComponent />
      <Switch>
        <Route path="/" component={HomeProfilesComponent} exact />
        <Route path="/profile" component={ProfileComponent} />
        <Route component={Error} />
      </Switch>
    </main>
  );
}

export default App;
