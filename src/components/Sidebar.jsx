import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: '대시보드' },
    { path: '/blocks', icon: '🧊', label: '블록' },
    { path: '/witnesses', icon: '👥', label: '증인' },
    { path: '/posts', icon: '📝', label: '포스트' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Steem Explorer</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
