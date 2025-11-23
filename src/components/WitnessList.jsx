import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWitnessesByVote } from '../services/steemApi';
import './WitnessList.css';

const WitnessList = ({ limit = 20 }) => {
  const [witnesses, setWitnesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWitnesses();
  }, [limit]);

  const loadWitnesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const witnessData = await getWitnessesByVote(limit);
      setWitnesses(witnessData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatVotes = (votes) => {
    // Convert VESTS to more readable format (millions)
    if (!votes || votes === 0) return '0.00M';
    const votesMillion = (parseInt(votes) / 1000000000000).toFixed(2);
    return `${votesMillion}M`;
  };

  const isTop20Witness = (index) => {
    return index < 20;
  };

  if (loading) {
    return (
      <div className="witness-list">
        <div className="witness-list-header">
          <h2>Top Witnesses</h2>
          <p className="witness-description">Witnesses secure the Steem blockchain by producing blocks</p>
        </div>
        <div className="loading">Loading witnesses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="witness-list">
        <div className="witness-list-header">
          <h2>Top Witnesses</h2>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (witnesses.length === 0) {
    return (
      <div className="witness-list">
        <div className="witness-list-header">
          <h2>Top Witnesses</h2>
        </div>
        <div className="info">No witnesses found.</div>
      </div>
    );
  }

  return (
    <div className="witness-list">
      <div className="witness-list-header">
        <h2>Top Witnesses</h2>
        <p className="witness-description">
          Witnesses secure the Steem blockchain by producing blocks.
          Top 20 witnesses produce most blocks, while others share remaining slots.
        </p>
      </div>

      <div className="witness-table">
        <div className="witness-table-header">
          <div className="witness-rank">Rank</div>
          <div className="witness-name">Witness</div>
          <div className="witness-votes">Votes (MVESTS)</div>
          <div className="witness-status">Status</div>
        </div>

        {witnesses.map((witness, index) => (
          <div key={witness.owner} className="witness-row">
            <div className="witness-rank">#{index + 1}</div>
            <div className="witness-name">
              <Link to={`/account/${witness.owner}`}>
                {witness.owner}
              </Link>
            </div>
            <div className="witness-votes">{formatVotes(witness.votes)}</div>
            <div className="witness-status">
              {isTop20Witness(index) ? (
                <span className="status-top20">Top 20</span>
              ) : (
                <span className="status-timeshare">Timeshare</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="witness-footer">
        <button onClick={loadWitnesses} className="refresh-button">
          Refresh Witnesses
        </button>
      </div>
    </div>
  );
};

export default WitnessList;
