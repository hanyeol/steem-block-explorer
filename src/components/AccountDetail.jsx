import { useNavigate } from 'react-router-dom';
import './AccountDetail.css';

const AccountDetail = ({ account }) => {
  const navigate = useNavigate();

  if (!account) return null;

  // Parse JSON metadata safely
  let metadata = {};
  try {
    metadata = account.json_metadata ? JSON.parse(account.json_metadata) : {};
  } catch (e) {
    metadata = {};
  }

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format STEEM token amounts
  const formatToken = (tokenData) => {
    if (!tokenData) return '0.000';

    // Handle new format: {amount: "0", precision: 3, nai: "..."}
    if (typeof tokenData === 'object' && tokenData.amount !== undefined) {
      const amount = parseInt(tokenData.amount);
      const precision = tokenData.precision || 3;
      const value = amount / Math.pow(10, precision);
      return value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    }

    // Handle old format: "123.456 STEEM"
    if (typeof tokenData === 'string') {
      return parseFloat(tokenData).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }

    return '0.000';
  };

  // Calculate voting power percentage
  const votingPower = ((account.voting_power || 0) / 100).toFixed(2);

  // Calculate reputation score (same as Steemit)
  const calculateReputation = (rep) => {
    if (rep == null) return 25;
    let reputation = parseInt(rep);
    let isNeg = reputation < 0;
    reputation = Math.log10(Math.abs(reputation)) - 9;
    reputation = Math.max(reputation * 9 + 25, 0);
    if (isNeg) reputation = 50 - reputation;
    return Math.floor(reputation);
  };

  const reputation = calculateReputation(account.reputation);

  return (
    <div className="account-detail">
      <div className="account-header">
        <div className="account-title">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <h1>@{account.name}</h1>
        </div>
        <div className="reputation-badge">
          Reputation: {reputation}
        </div>
      </div>

      {/* Profile Section */}
      <div className="detail-section">
        <h2>Profile</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">ID:</span>
            <span className="value">{account.id}</span>
          </div>
          {metadata.profile?.name && (
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{metadata.profile.name}</span>
            </div>
          )}
          {metadata.profile?.about && (
            <div className="detail-item full-width">
              <span className="label">About:</span>
              <span className="value">{metadata.profile.about}</span>
            </div>
          )}
          {metadata.profile?.location && (
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{metadata.profile.location}</span>
            </div>
          )}
          {metadata.profile?.website && (
            <div className="detail-item">
              <span className="label">Website:</span>
              <span className="value">
                <a href={metadata.profile.website} target="_blank" rel="noopener noreferrer">
                  {metadata.profile.website}
                </a>
              </span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">Created:</span>
            <span className="value">{formatDate(account.created)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Last Active:</span>
            <span className="value">{formatDate(account.last_post)}</span>
          </div>
        </div>
      </div>

      {/* Balances Section */}
      <div className="detail-section">
        <h2>Balances</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">STEEM:</span>
            <span className="value">{formatToken(account.balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">STEEM Power:</span>
            <span className="value">{formatToken(account.vesting_shares)}</span>
          </div>
          <div className="detail-item">
            <span className="label">SBD:</span>
            <span className="value">{formatToken(account.sbd_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Savings STEEM:</span>
            <span className="value">{formatToken(account.savings_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Savings SBD:</span>
            <span className="value">{formatToken(account.savings_sbd_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Reward STEEM:</span>
            <span className="value">{formatToken(account.reward_steem_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Reward SBD:</span>
            <span className="value">{formatToken(account.reward_sbd_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Reward SP:</span>
            <span className="value">{formatToken(account.reward_vesting_balance)}</span>
          </div>
        </div>
      </div>

      {/* Activity Stats Section */}
      <div className="detail-section">
        <h2>Activity</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">Post Count:</span>
            <span className="value">{account.post_count?.toLocaleString() || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Voting Power:</span>
            <span className="value">{votingPower}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Following:</span>
            <span className="value">{account.following_count?.toLocaleString() || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Followers:</span>
            <span className="value">{account.follower_count?.toLocaleString() || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Witness Votes:</span>
            <span className="value">{account.witnesses_voted_for || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Proxy:</span>
            <span className="value">{account.proxy || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Recovery & Keys Section */}
      <div className="detail-section">
        <h2>Security</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">Recovery Account:</span>
            <span className="value">
              <a
                href={`/account/${account.recovery_account}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/account/${account.recovery_account}`);
                }}
                className="account-link"
              >
                @{account.recovery_account}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Memo Key:</span>
            <span className="value memo-key">{account.memo_key}</span>
          </div>
        </div>
      </div>

      {/* Raw JSON Section (collapsible) */}
      <details className="detail-section raw-json">
        <summary>Raw JSON Data</summary>
        <pre>{JSON.stringify(account, null, 2)}</pre>
      </details>
    </div>
  );
};

export default AccountDetail;
