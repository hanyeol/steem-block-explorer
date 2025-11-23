import { Link } from 'react-router-dom';
import DetailLayout from './DetailLayout';
import './AccountDetail.css';

const AccountDetail = ({ account }) => {
  if (!account) return null;

  // Parse JSON metadata safely
  let metadata = {};
  try {
    metadata = account.json_metadata ? JSON.parse(account.json_metadata) : {};
  } catch {
    metadata = {};
  }

  // Format dates for display
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
    <DetailLayout
      className="account-detail"
      title={`@${account.name}`}
      backTo="/"
      actions={(
        <div className="reputation-badge">
          Reputation: {reputation}
        </div>
      )}
    >
      <div className="detail-section">
        <h3>Profile Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">Account ID:</span>
            <span className="value">{account.id}</span>
          </div>
          <div className="detail-item">
            <span className="label">Created Date:</span>
            <span className="value">{formatDate(account.created)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Last Active:</span>
            <span className="value">{formatDate(account.last_post)}</span>
          </div>
          {metadata.profile?.name && (
            <div className="detail-item">
              <span className="label">Display Name:</span>
              <span className="value">{metadata.profile.name}</span>
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
                <a href={metadata.profile.website} target="_blank" rel="noopener noreferrer" className="external-link">
                  {metadata.profile.website}
                </a>
              </span>
            </div>
          )}
          {metadata.profile?.about && (
            <div className="detail-item full-width">
              <span className="label">About:</span>
              <span className="value">{metadata.profile.about}</span>
            </div>
          )}
        </div>
      </div>

      {/* Balances Section */}
      <div className="detail-section">
        <h3>Account Balances</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">STEEM Balance:</span>
            <span className="value">{formatToken(account.balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">STEEM Power:</span>
            <span className="value">{formatToken(account.vesting_shares)}</span>
          </div>
          <div className="detail-item">
            <span className="label">SBD Balance:</span>
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
            <span className="label">Pending STEEM Rewards:</span>
            <span className="value">{formatToken(account.reward_steem_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Pending SBD Rewards:</span>
            <span className="value">{formatToken(account.reward_sbd_balance)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Pending SP Rewards:</span>
            <span className="value">{formatToken(account.reward_vesting_balance)}</span>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="detail-section">
        <h3>Activity Statistics</h3>
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
            <span className="label">Following Count:</span>
            <span className="value">{account.following_count?.toLocaleString() || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Followers Count:</span>
            <span className="value">{account.follower_count?.toLocaleString() || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Witness Votes Cast:</span>
            <span className="value">{account.witnesses_voted_for || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Voting Proxy:</span>
            <span className="value">{account.proxy || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="detail-section">
        <h3>Security Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">Recovery Account:</span>
            <span className="value">
              <Link
                to={`/account/${account.recovery_account}`}
                className="internal-link"
              >
                @{account.recovery_account}
              </Link>
            </span>
          </div>
          <div className="detail-item full-width">
            <span className="label">Memo Public Key:</span>
            <span className="value hash">{account.memo_key}</span>
          </div>
        </div>
      </div>

      {/* Raw JSON Section */}
      <details className="detail-section">
        <summary className="collapsible-header">Raw JSON Data</summary>
        <pre className="json-data">{JSON.stringify(account, null, 2)}</pre>
      </details>
    </DetailLayout>
  );
};

export default AccountDetail;
