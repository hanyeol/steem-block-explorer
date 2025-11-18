import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccount } from '../services/steemApi';
import AccountDetail from '../components/AccountDetail';
import './AccountPage.css';

const AccountPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const accountData = await getAccount(username);
        if (!accountData) {
          setError(`Account "${username}" not found`);
          setAccount(null);
        } else {
          setAccount(accountData);
        }
      } catch (err) {
        setError(`Failed to fetch account: ${err.message}`);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [username]);

  if (loading) {
    return (
      <div className="account-page">
        <div className="loading">Loading account...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <AccountDetail account={account} />
    </div>
  );
};

export default AccountPage;
