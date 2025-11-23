import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supportedLanguages, useTranslation } from '../i18n.jsx';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { path: '/', icon: '📊', label: t('sidebar.dashboard') },
    { path: '/blocks', icon: '🧊', label: t('sidebar.blocks') },
    { path: '/witnesses', icon: '👥', label: t('sidebar.witnesses') },
    { path: '/posts', icon: '📝', label: t('sidebar.posts') },
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
      <div className="sidebar-footer">
        <div className="sidebar-lang-label">{t('sidebar.language')}</div>
        <div
          className={`sidebar-lang-dropdown ${isLangOpen ? 'open' : ''}`}
          ref={dropdownRef}
        >
          <button
            type="button"
            className="lang-trigger"
            onClick={() => setIsLangOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isLangOpen}
          >
            <span className="lang-prefix">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/>
              </svg>
            </span>
            <span className="lang-current">
              {supportedLanguages.find((l) => l.code === language)?.label || language}
            </span>
            <span className="lang-caret">▾</span>
          </button>
          {isLangOpen && (
            <div className="lang-options" role="listbox">
              {supportedLanguages
                .filter((lang) => lang.code !== language)
                .map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className="lang-option"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                  >
                    <span className="lang-dot" aria-hidden="true">•</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
