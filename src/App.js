import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Main from './components/Main/Main';

function App() {
  return <div className="App">
    <Router>
      <Switch>
        <Route path="/:event_hash?" component={Main}  />
      </Switch>
    </Router>
  </div>

}

export default App;
