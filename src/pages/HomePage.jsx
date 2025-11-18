import { useNavigate } from 'react-router-dom';
import BlockList from '../components/BlockList';
import SearchBar from '../components/SearchBar';
import WitnessList from '../components/WitnessList';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchValue) => {
    // If search value is a number, navigate to block page
    if (/^\d+$/.test(searchValue)) {
      navigate(`/block/${searchValue}`);
    } else {
      // Otherwise, treat it as an account name
      navigate(`/account/${searchValue}`);
    }
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Steem Block Explorer</h1>
        <p className="subtitle">Explore blocks, transactions, and accounts on the Steem blockchain</p>
      </header>

      <SearchBar onSearch={handleSearch} />
      <BlockList />
      <WitnessList limit={25} />
    </div>
  );
};

export default HomePage;
