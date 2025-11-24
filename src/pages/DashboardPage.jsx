import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestBlockNum, getBlocks, getDynamicGlobalProperties } from '../services/steemApi';
import BlockTable from '../components/BlockTable';
import { useTranslation } from '../i18n.jsx';
import './DashboardPage.css';

// Helper function to format asset objects
const formatAsset = (asset) => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'amount' in asset) {
    const amount = asset.amount / Math.pow(10, asset.precision);
    return `${amount.toFixed(asset.precision)} STEEM`;
  }
  return 'N/A';
};

// Helper function to format vesting shares
const formatVestingShares = (shares) => {
  if (typeof shares === 'string') return shares;
  if (shares && typeof shares === 'object' && 'amount' in shares) {
    const amount = shares.amount / Math.pow(10, shares.precision);
    return `${amount.toFixed(0)} VESTS`;
  }
  return 'N/A';
};

// Helper function to calculate STEEM per VESTS
const calculateSteemPerVests = (totalVestingFund, totalVestingShares) => {
  if (!totalVestingFund || !totalVestingShares) return 'N/A';

  const vestingFundAmount = typeof totalVestingFund === 'object'
    ? totalVestingFund.amount / Math.pow(10, totalVestingFund.precision)
    : parseFloat(totalVestingFund);

  const vestingSharesAmount = typeof totalVestingShares === 'object'
    ? totalVestingShares.amount / Math.pow(10, totalVestingShares.precision)
    : parseFloat(totalVestingShares);

  if (vestingSharesAmount === 0) return 'N/A';

  const steemPerVests = vestingFundAmount / vestingSharesAmount;
  return steemPerVests.toFixed(6);
};

function DashboardPage() {
  const [stats, setStats] = useState({
    headBlockNumber: 0,
    totalAccounts: '',
    currentSupply: '',
    virtualSupply: '',
    steemPerVests: 'N/A',
    recentBlocks: [],
  });
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const props = await getDynamicGlobalProperties();
        const latestBlockNum = await getLatestBlockNum();
        const blocks = await getBlocks(latestBlockNum - 9, 10);

        setStats({
          headBlockNumber: latestBlockNum,
          totalAccounts: formatVestingShares(props.total_vesting_shares),
          currentSupply: formatAsset(props.current_supply),
          virtualSupply: formatAsset(props.virtual_supply),
          steemPerVests: calculateSteemPerVests(props.total_vesting_fund_steem, props.total_vesting_shares),
          recentBlocks: blocks.reverse(),
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">{t('dashboard.title')}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🧊</div>
          <div className="stat-content">
            <div className="stat-label">{t('dashboard.stats.latestBlock')}</div>
            <div className="stat-value">{stats.headBlockNumber}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">{t('dashboard.stats.currentSupply')}</div>
            <div className="stat-value">{stats.currentSupply}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">{t('dashboard.stats.virtualSupply')}</div>
            <div className="stat-value">{stats.virtualSupply}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-label">{t('dashboard.stats.totalVesting')}</div>
            <div className="stat-value">{stats.totalAccounts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💲</div>
          <div className="stat-content">
            <div className="stat-label">{t('dashboard.stats.steemPerVests')}</div>
            <div className="stat-value">{stats.steemPerVests} STEEM</div>
          </div>
        </div>
      </div>

      <div className="recent-blocks-section">
        <h2 className="section-title">{t('dashboard.recentBlocks')}</h2>
        <BlockTable
          columns={[
            {
              key: 'number',
              label: t('common.blockNumber'),
              width: '150px',
              className: 'block-number',
              render: (block) => `#${block.block_num}`,
            },
            {
              key: 'time',
              label: t('common.time'),
              width: '220px',
              className: 'block-time',
              render: (block) => new Date(block.timestamp + 'Z').toLocaleString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : undefined),
            },
            {
              key: 'witness',
              label: t('common.witness'),
              className: 'block-witness',
              render: (block) => {
                if (!block.witness) return 'N/A';
                return (
                  <Link
                    to={`/account/${block.witness}`}
                    className="block-witness"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {block.witness}
                  </Link>
                );
              },
            },
            {
              key: 'tx',
              label: t('common.transactions'),
              width: '140px',
              className: 'block-tx-count',
              render: (block) => (
                <span className="badge">{block.transactions?.length || 0}</span>
              ),
            },
          ]}
          rows={stats.recentBlocks.filter((block) => block && block.block_num)}
          rowKey={(block) => block.block_id || block.block_num}
          rowLink={(block) => `/block/${block.block_num}`}
          emptyMessage={t('dashboard.emptyBlocks')}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
