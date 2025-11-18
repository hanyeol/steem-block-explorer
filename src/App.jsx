import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlockPage from './pages/BlockPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/block/:blockNum" element={<BlockPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
