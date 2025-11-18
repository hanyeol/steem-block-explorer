import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLatestBlockNum, getBlocks } from '../services/steemApi';
import { BlockListSkeleton } from './SkeletonLoader';
import './BlockList.css';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);

  useEffect(() => {
    loadBlocks();
    // Refresh every 3 seconds (Steem block time)
    const interval = setInterval(loadBlocks, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadBlocks = async () => {
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
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp + 'Z').toLocaleString();
  };

  if (loading) {
    return <BlockListSkeleton />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="block-list">
      <div className="block-header">
        <h2>Latest Blocks</h2>
        <div className="latest-block-info">
          Latest Block: <span className="highlight">{latestBlock}</span>
        </div>
      </div>

      <table className="block-table">
        <thead>
          <tr>
            <th>Block Number</th>
            <th>Timestamp</th>
            <th>Transactions</th>
            <th>Witness</th>
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
              <td>{block.transactions.length}</td>
              <td className="witness">{block.witness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockList;
