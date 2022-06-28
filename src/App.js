import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './components/Main/Main';

function App() {
  return <div className="App">
    <Router>
      <Routes>
        <Route element={<Main />}   path='/:event_hash' />
        <Route element={<Main />}   path='/' />
      </Routes>
    </Router>
  </div>

}

export default App;
