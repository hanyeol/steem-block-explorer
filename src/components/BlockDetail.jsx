import { Link } from 'react-router-dom';
import DetailLayout from './DetailLayout';
import './BlockDetail.css';

const BlockDetail = ({ blockNum, block }) => {
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(`${timestamp}Z`).toLocaleString();
  };

  if (!block) {
    return null;
  }

  const blockNumber = parseInt(blockNum, 10);
  const transactionCount = block?.transactions?.length || 0;
  const prevBlockNum = blockNumber > 1 ? blockNumber - 1 : null;
  const nextBlockNum = blockNumber + 1;

  return (
    <DetailLayout
      className="block-detail"
      title={`Block #${blockNumber.toLocaleString()}`}
      backTo="/blocks"
      actions={(
        <>
          <Link
            to={prevBlockNum ? `/block/${prevBlockNum}` : '#'}
            className={`nav-button ${prevBlockNum ? '' : 'disabled'}`}
            aria-disabled={!prevBlockNum}
            onClick={(e) => { if (!prevBlockNum) e.preventDefault(); }}
          >
            Previous Block
          </Link>
          <Link
            to={`/block/${nextBlockNum}`}
            className="nav-button"
          >
            Next Block
          </Link>
        </>
      )}
    >
      <div className="detail-section">
        <h3>Block Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">시간:</span>
            <span className="value">{formatTimestamp(block.timestamp)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Witness:</span>
            <span className="value">{block.witness}</span>
          </div>
          <div className="detail-item">
            <span className="label">Transaction Count:</span>
            <span className="value">{transactionCount}</span>
          </div>
          <div className="detail-item">
            <span className="label">Previous Block Hash:</span>
            <span className="value hash">{block.previous}</span>
          </div>
          <div className="detail-item">
            <span className="label">Transaction Merkle Root:</span>
            <span className="value hash">{block.transaction_merkle_root}</span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="detail-section">
        <h3>Transactions ({transactionCount})</h3>
        {!block.transactions || block.transactions.length === 0 ? (
          <div className="empty-state">No transactions in this block</div>
        ) : (
          <div className="transactions-list">
            {block.transactions.map((tx, txIndex) => (
              <div key={txIndex} className="transaction-card">
                <div className="transaction-header">
                  <span className="transaction-title">Transaction #{txIndex}</span>
                  <span className="transaction-meta">{tx.operations?.length || 0} operations</span>
                </div>
                <div className="operations-list">
                  {tx.operations?.map((op, opIndex) => (
                    <div key={opIndex} className="operation-item">
                      <div className="operation-type">{op[0]}</div>
                      <pre className="operation-data">{JSON.stringify(op[1], null, 2)}</pre>
                    </div>
                  )) || <div className="empty-state">No operations</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw JSON Section */}
      <details className="detail-section">
        <summary className="collapsible-header">Raw JSON Data</summary>
        <pre className="json-data">{JSON.stringify(block, null, 2)}</pre>
      </details>
    </DetailLayout>
  );
};

export default BlockDetail;
