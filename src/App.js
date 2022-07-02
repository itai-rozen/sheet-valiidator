import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './components/Main/Main';

function App() {
  return <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Main />} >
          <Route path=":event_hash" element={<Main />} />
          <Route path="" element={<Main />} />
        </Route>
      </Routes>
    </Router>
  </div>

}

export default App;
