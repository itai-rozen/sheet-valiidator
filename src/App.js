import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Main from './components/Main/Main';

function App() {
  return <div className="App">
    <Router>
        <Route path="/:event_hash?" component={Main}  />
    </Router>
  </div>

}

export default App;
