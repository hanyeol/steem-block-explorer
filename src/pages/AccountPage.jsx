import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccount } from '../services/steemApi';
import AccountDetail from '../components/AccountDetail';
import DetailLayout from '../components/DetailLayout';

const AccountPage = () => {
  const { username } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!username) return;

      // Don't show loading on refresh (only on initial load)
      if (!hasLoaded.current) {
        setLoading(true);
      }
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
        hasLoaded.current = true;
      }
    };

    hasLoaded.current = false;
    fetchAccount();

    // Refresh every 10 seconds
    const interval = setInterval(fetchAccount, 10000);

    return () => clearInterval(interval);
  }, [username]);

  if (loading) {
    return (
      <DetailLayout
        className="account-detail"
        title={username ? `@${username}` : 'Account'}
        backTo="/"
      >
        <div className="loading">Loading account...</div>
      </DetailLayout>
    );
  }

  if (error) {
    return (
      <DetailLayout
        className="account-detail"
        title={username ? `@${username}` : 'Account'}
        backTo="/"
      >
        <div className="error-container">
          <p className="error">{error}</p>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </DetailLayout>
    );
  }

  return (
    <AccountDetail account={account} />
  );
};

export default AccountPage;
