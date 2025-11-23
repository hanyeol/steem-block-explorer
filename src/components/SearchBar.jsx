import { useState } from 'react';
import { useTranslation } from '../i18n.jsx';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('searchBar.placeholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          {t('searchBar.button')}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
