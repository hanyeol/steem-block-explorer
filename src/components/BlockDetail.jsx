import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlock } from '../services/steemApi';
import { BlockDetailSkeleton } from './SkeletonLoader';
import './BlockDetail.css';

const BlockDetail = () => {
  const { blockNum } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlock();
  }, [blockNum]);

  const loadBlock = async () => {
    try {
      setLoading(true);
      const blockData = await getBlock(parseInt(blockNum));
      setBlock(blockData);
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
    return <BlockDetailSkeleton />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!block) {
    return <div className="error">Block not found</div>;
  }

  return (
    <div className="block-detail">
      <div className="navigation">
        <Link to="/" className="back-button">← Back to Blocks</Link>
        <div className="block-navigation">
          <Link to={`/block/${parseInt(blockNum) - 1}`} className="nav-button">Previous</Link>
          <Link to={`/block/${parseInt(blockNum) + 1}`} className="nav-button">Next</Link>
        </div>
      </div>

      <h2>Block #{blockNum}</h2>

      <div className="block-info">
        <div className="info-row">
          <span className="label">Timestamp:</span>
          <span className="value">{formatTimestamp(block.timestamp)}</span>
        </div>
        <div className="info-row">
          <span className="label">Witness:</span>
          <span className="value">{block.witness}</span>
        </div>
        <div className="info-row">
          <span className="label">Transactions:</span>
          <span className="value">{block.transactions.length}</span>
        </div>
        <div className="info-row">
          <span className="label">Previous Block:</span>
          <span className="value">{block.previous}</span>
        </div>
        <div className="info-row">
          <span className="label">Transaction Merkle Root:</span>
          <span className="value hash">{block.transaction_merkle_root}</span>
        </div>
      </div>

      <h3>Transactions ({block.transactions.length})</h3>
      <div className="transactions">
        {block.transactions.length === 0 ? (
          <div className="no-transactions">No transactions in this block</div>
        ) : (
          block.transactions.map((tx, index) => (
            <div key={index} className="transaction">
              <div className="tx-header">
                <span className="tx-index">Transaction #{index}</span>
                <span className="tx-ops">{tx.operations.length} operations</span>
              </div>
              <div className="operations">
                {tx.operations.map((op, opIndex) => (
                  <div key={opIndex} className="operation">
                    <span className="op-type">{op[0]}</span>
                    <pre className="op-data">{JSON.stringify(op[1], null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockDetail;
