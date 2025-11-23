import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlockDetail from '../components/BlockDetail';
import DetailLayout from '../components/DetailLayout';
import { BlockDetailSkeleton } from '../components/SkeletonLoader';
import { getBlock } from '../services/steemApi';

const BlockPage = () => {
  const { blockNum } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlock = async () => {
      setLoading(true);
      setError(null);

      const parsedBlockNum = parseInt(blockNum, 10);
      if (!blockNum || Number.isNaN(parsedBlockNum)) {
        setError('Invalid block number');
        setBlock(null);
        setLoading(false);
        return;
      }

      try {
        const blockData = await getBlock(parsedBlockNum);
        const normalizedBlock = blockData?.block || blockData;

        if (!normalizedBlock) {
          setError('Block not found');
          setBlock(null);
        } else {
          setBlock(normalizedBlock);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch block');
        setBlock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [blockNum]);

  if (loading) {
    return (
      <div className="block-page">
        <BlockDetailSkeleton />
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="block-page">
        <DetailLayout
          className="block-detail"
          title={`Block #${blockNum}`}
          backTo="/blocks"
        >
          <div className="error-container">
            <p className="error">Error: {error || 'Block not found'}</p>
            <Link to="/blocks" className="back-button">Back to Blocks</Link>
          </div>
        </DetailLayout>
      </div>
    );
  }

  return (
    <div className="block-page">
      <BlockDetail blockNum={blockNum} block={block} />
    </div>
  );
};

export default BlockPage;
