import { useState, useEffect } from 'react';
import { getLatestBlockNum, getBlocks } from '../services/steemApi';
import BlockTable from '../components/BlockTable';
import './BlocksPage.css';

function BlocksPage() {
  const [blocks, setBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestBlock, setLatestBlock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const blocksPerPage = 20;

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
    return <div className="blocks-loading">블록 데이터를 불러오는 중...</div>;
  }

  return (
    <div className="blocks-page">
      <div className="blocks-header">
        <h1 className="blocks-title">블록 탐색</h1>
        <form onSubmit={handleSearch} className="block-search">
          <input
            type="text"
            placeholder="블록 번호 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
      </div>

      <div className="blocks-info">
        <div className="info-badge">
          최신 블록: <strong>#{latestBlock.toLocaleString()}</strong>
        </div>
        <div className="info-badge">
          페이지: <strong>{currentPage} / {totalPages.toLocaleString()}</strong>
        </div>
      </div>

      <BlockTable
        columns={[
          {
            key: 'number',
            label: '블록 번호',
            width: '150px',
            className: 'block-number',
            render: (block) => `#${block.block_num}`,
          },
          {
            key: 'timestamp',
            label: '시간',
            width: '220px',
            className: 'block-timestamp',
            render: (block) => new Date(block.timestamp + 'Z').toLocaleString('ko-KR'),
          },
          {
            key: 'witness',
            label: '증인',
            className: 'block-witness',
            render: (block) => block.witness || 'N/A',
          },
          {
            key: 'txs',
            label: '트랜잭션',
            width: '140px',
            className: 'block-tx-count',
            render: (block) => <span className="badge">{block.transactions?.length || 0}</span>,
          },
          {
            key: 'size',
            label: '크기',
            width: '120px',
            className: 'block-size',
            render: (block) => `${(JSON.stringify(block).length / 1024).toFixed(2)} KB`,
          },
        ]}
        rows={blocks.filter((block) => block && block.block_num)}
        rowKey={(block) => block.block_id || block.block_num}
        rowLink={(block) => `/block/${block.block_num}`}
        cellLink={(col, block) => (col.key === 'witness' && block.witness ? `/account/${block.witness}` : null)}
        emptyMessage="블록 정보를 불러오지 못했습니다."
      />

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ← 이전
        </button>
        <span className="pagination-info">
          페이지 {currentPage} / {totalPages.toLocaleString()}
        </span>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

export default BlocksPage;
