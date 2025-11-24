import { useState, useEffect } from 'react';
import { getLatestBlockNum, getBlocks } from '../services/steemApi';
import BlockTable from '../components/BlockTable';
import { useTranslation } from '../i18n.jsx';
import './BlocksPage.css';

function BlocksPage() {
  const [blocks, setBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestBlock, setLatestBlock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const blocksPerPage = 20;
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const latest = await getLatestBlockNum();
        setLatestBlock(latest);

        const endBlock = latest - (currentPage - 1) * blocksPerPage;
        const startBlock = endBlock - blocksPerPage + 1;
        const fetchedBlocks = await getBlocks(startBlock, blocksPerPage);

        setBlocks(fetchedBlocks.reverse());
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch blocks:', error);
        setLoading(false);
      }
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 3000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    const blockNum = parseInt(searchInput);
    if (!isNaN(blockNum) && blockNum > 0) {
      window.location.href = `/block/${blockNum}`;
    }
  };

  const totalPages = Math.ceil(latestBlock / blocksPerPage);

  if (loading) {
    return <div className="blocks-loading">{t('blocksPage.loading')}</div>;
  }

  return (
    <div className="blocks-page">
      <div className="blocks-header">
        <h1 className="blocks-title">{t('blocksPage.title')}</h1>
        <form onSubmit={handleSearch} className="block-search">
          <input
            type="text"
            placeholder={t('blocksPage.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">{t('blocksPage.searchButton')}</button>
        </form>
      </div>

      <div className="blocks-info">
        <div className="info-badge">
          {t('blocksPage.infoLatest', { num: latestBlock })}
        </div>
        <div className="info-badge">
          {t('blocksPage.infoPage', { current: currentPage, total: totalPages.toLocaleString() })}
        </div>
      </div>

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
            key: 'timestamp',
            label: t('common.time'),
            width: '220px',
            className: 'block-timestamp',
            render: (block) => new Date(block.timestamp + 'Z').toLocaleString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : undefined),
          },
          {
            key: 'witness',
            label: t('common.witness'),
            className: 'block-witness',
            render: (block) => block.witness || 'N/A',
          },
          {
            key: 'txs',
            label: t('common.transactions'),
            width: '140px',
            className: 'block-tx-count',
            render: (block) => <span className="badge">{block.transactions?.length || 0}</span>,
          },
          {
            key: 'size',
            label: t('common.size'),
            width: '120px',
            className: 'block-size',
            render: (block) => `${(JSON.stringify(block).length / 1024).toFixed(2)} KB`,
          },
        ]}
        rows={blocks.filter((block) => block && block.block_num)}
        rowKey={(block) => block.block_id || block.block_num}
        rowLink={(block) => `/block/${block.block_num}`}
        cellLink={(col, block) => (col.key === 'witness' && block.witness ? `/account/${block.witness}` : null)}
        emptyMessage={t('blocksPage.empty')}
      />

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          {t('blocksPage.paginationPrev')}
        </button>
        <span className="pagination-info">
          {t('blocksPage.infoPage', { current: currentPage, total: totalPages.toLocaleString() })}
        </span>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          {t('blocksPage.paginationNext')}
        </button>
      </div>
    </div>
  );
}

export default BlocksPage;
