import { Link } from 'react-router-dom';
import DetailLayout from './DetailLayout';
import { useTranslation } from '../i18n.jsx';
import { formatTimestampWithLocale } from '../utils/format';
import './BlockDetail.css';

const BlockDetail = ({ blockNum, block }) => {
  const { t, language } = useTranslation();
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return formatTimestampWithLocale(timestamp, language);
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
      title={`${t('common.blockNumber')} #${blockNumber.toLocaleString()}`}
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
        <h3>{t('blockDetail.info')}</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="label">{t('blockDetail.time')}:</span>
            <span className="value">{formatTimestamp(block.timestamp)}</span>
          </div>
          <div className="detail-item">
            <span className="label">{t('blockDetail.witness')}:</span>
            <span className="value">{block.witness}</span>
          </div>
          <div className="detail-item">
            <span className="label">{t('blockDetail.transactionCount')}:</span>
            <span className="value">{transactionCount}</span>
          </div>
          <div className="detail-item">
            <span className="label">{t('blockDetail.prevHash')}:</span>
            <span className="value hash">{block.previous}</span>
          </div>
          <div className="detail-item">
            <span className="label">{t('blockDetail.merkle')}:</span>
            <span className="value hash">{block.transaction_merkle_root}</span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="detail-section">
        <h3>{t('blockDetail.transactions', { count: transactionCount })}</h3>
        {!block.transactions || block.transactions.length === 0 ? (
          <div className="empty-state">{t('blockDetail.noTransactions')}</div>
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
        <summary className="collapsible-header">{t('blockDetail.rawJson')}</summary>
        <pre className="json-data">{JSON.stringify(block, null, 2)}</pre>
      </details>
    </DetailLayout>
  );
};

export default BlockDetail;
