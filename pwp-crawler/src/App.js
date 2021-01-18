import './App.css';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import { Route, Switch } from 'react-router-dom';
import ProfileComponent from './components/ProfileComponent';

function App() {
  
  return (
    <main>
      <HeaderComponent />
      <Switch>
        <Route path="/" component={HomeComponent} exact />
        <Route path="/profile" component={ProfileComponent} />
        <Route component={Error} />
      </Switch>
    </main>
  );
}

export default App;
