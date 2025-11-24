import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWitnessesByVote } from '../services/steemApi';
import { useTranslation } from '../i18n.jsx';
import './WitnessesPage.css';

// Helper function to format asset objects
const formatAsset = (asset) => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'amount' in asset) {
    const amount = asset.amount / Math.pow(10, asset.precision);
    const symbol = asset.nai === '@@000000021' ? 'STEEM' : 'SBD';
    return `${amount.toFixed(asset.precision)} ${symbol}`;
  }
  return 'N/A';
};

function WitnessesPage() {
  const [witnesses, setWitnesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWitnesses = async () => {
      try {
        const witnessData = await getWitnessesByVote(100);
        setWitnesses(witnessData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch witnesses:', error);
        setLoading(false);
      }
    };

    fetchWitnesses();
    const interval = setInterval(fetchWitnesses, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="witnesses-loading">{t('witnesses.loading')}</div>;
  }

  return (
    <div className="witnesses-page">
      <div className="witnesses-header">
        <h1 className="witnesses-title">{t('witnesses.title')}</h1>
        <div className="witnesses-info">
          {t('witnesses.total', { count: witnesses.length })}
        </div>
      </div>

      <div className="witnesses-grid">
        {witnesses.map((witness, index) => (
          <div key={witness.owner} className="witness-card">
            <div className="witness-rank">#{index + 1}</div>
            <div className="witness-content">
              <Link to={`/account/${witness.owner}`} className="witness-name">
                {witness.owner}
              </Link>
              <div className="witness-details">
                <div className="witness-detail-item">
                  <span className="detail-label">{t('witnesses.votes')}:</span>
                  <span className="detail-value">
                    {Math.floor(Number(witness.votes || 0) / 1e9).toLocaleString()} MV
                  </span>
                </div>
                <div className="witness-detail-item">
                  <span className="detail-label">{t('witnesses.price')}:</span>
                  <span className="detail-value">{formatAsset(witness.sbd_exchange_rate?.base)}</span>
                </div>
                <div className="witness-detail-item">
                  <span className="detail-label">{t('witnesses.blockSize')}:</span>
                  <span className="detail-value">
                    {witness.props?.maximum_block_size?.toLocaleString() || 'N/A'} bytes
                  </span>
                </div>
                <div className="witness-detail-item">
                  <span className="detail-label">{t('witnesses.accountCreation')}:</span>
                  <span className="detail-value">
                    {formatAsset(witness.props?.account_creation_fee)}
                  </span>
                </div>
              </div>
              <div className="witness-url">
                {witness.url && (
                  <a
                    href={witness.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="witness-link"
                  >
                    🔗 {t('witnesses.website')}
                  </a>
                )}
              </div>
              <div className="witness-signing-key">
                <span className="signing-key-label">{t('witnesses.signingKey')}:</span>
                <code className="signing-key-value">{witness.signing_key}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WitnessesPage;
