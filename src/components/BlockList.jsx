import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getLatestBlockNum, getBlocks, getWitnessesByVote } from '../services/steemApi';
import { BlockListSkeleton } from './SkeletonLoader';
import { useTranslation } from '../i18n.jsx';
import { formatTimestampWithLocale } from '../utils/format';
import './BlockList.css';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [top20Witnesses, setTop20Witnesses] = useState([]);
  const { t, language } = useTranslation();

  const loadBlocks = useCallback(async () => {
    try {
      const latest = await getLatestBlockNum();
      setLatestBlock(latest);
      const blockData = await getBlocks(latest, 20);
      setBlocks(blockData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const loadTop20Witnesses = useCallback(async () => {
    try {
      const witnesses = await getWitnessesByVote(20);
      const witnessNames = witnesses.map(w => w.owner);
      setTop20Witnesses(witnessNames);
    } catch (err) {
      console.error('Failed to load top 20 witnesses:', err);
    }
  }, []);

  // Fetch blocks and witness list on mount and keep refreshing
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadBlocks();
    loadTop20Witnesses();
    // Refresh every 3 seconds (Steem block time)
    const interval = setInterval(loadBlocks, 3000);
    return () => clearInterval(interval);
  }, [loadBlocks, loadTop20Witnesses]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isTimeshareWitness = (witnessName) => {
    // Only check if top20Witnesses is loaded
    if (top20Witnesses.length === 0) {
      return false;
    }
    return !top20Witnesses.includes(witnessName);
  };

  const formatTimestamp = (timestamp) => formatTimestampWithLocale(timestamp, language);

  if (loading) {
    return <BlockListSkeleton />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="block-list">
      <div className="block-header">
        <h2>{t('blockList.title')}</h2>
        <div className="latest-block-info">
          {t('common.latestBlock')}: <span className="highlight">{latestBlock}</span>
        </div>
      </div>

      <table className="block-table">
        <thead>
          <tr>
            <th>{t('common.blockNumber')}</th>
            <th>{t('common.time')}</th>
            <th>{t('common.transactions')}</th>
            <th>{t('common.witness')}</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, index) => (
            <tr key={index}>
              <td>
                <Link to={`/block/${latestBlock - index}`} className="block-link">
                  {latestBlock - index}
                </Link>
              </td>
              <td>{formatTimestamp(block.timestamp)}</td>
              <td>{block.transactions?.length || 0}</td>
              <td className="witness">
                <Link to={`/account/${block.witness}`} className="witness-link">
                  {block.witness}
                </Link>
                {isTimeshareWitness(block.witness) && (
                  <span className="timeshare-badge">Timeshare</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockList;
