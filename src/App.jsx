import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import BlocksPage from './pages/BlocksPage';
import WitnessesPage from './pages/WitnessesPage';
import PostsPage from './pages/PostsPage';
import BlockPage from './pages/BlockPage';
import AccountPage from './pages/AccountPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/witnesses" element={<WitnessesPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/block/:blockNum" element={<BlockPage />} />
            <Route path="/account/:username" element={<AccountPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
