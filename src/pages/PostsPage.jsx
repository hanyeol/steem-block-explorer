import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiscussions } from '../services/steemApi';
import './PostsPage.css';

// Helper function to format asset objects
const formatAsset = (asset) => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'amount' in asset) {
    const amount = asset.amount / Math.pow(10, asset.precision);
    const symbol = asset.nai === '@@000000021' ? 'STEEM' : asset.nai === '@@000000013' ? 'SBD' : '';
    return `${amount.toFixed(asset.precision)} ${symbol}`;
  }
  return 'N/A';
};

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await getDiscussions(sortBy, { limit: 20 });
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortBy]);

  if (loading) {
    return <div className="posts-loading">포스트 데이터를 불러오는 중...</div>;
  }

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1 className="posts-title">포스트</h1>
        <div className="sort-buttons">
          <button
            className={`sort-button ${sortBy === 'trending' ? 'active' : ''}`}
            onClick={() => setSortBy('trending')}
          >
            🔥 트렌딩
          </button>
          <button
            className={`sort-button ${sortBy === 'created' ? 'active' : ''}`}
            onClick={() => setSortBy('created')}
          >
            🆕 최신
          </button>
          <button
            className={`sort-button ${sortBy === 'hot' ? 'active' : ''}`}
            onClick={() => setSortBy('hot')}
          >
            ⚡ 인기
          </button>
        </div>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>현재 체인에 포스트가 없습니다.</p>
          </div>
        ) : (
          posts.filter(post => post && post.author && post.permlink).map((post) => (
            <article key={`${post.author}-${post.permlink}`} className="post-card">
              <div className="post-header">
                <Link to={`/account/${post.author}`} className="post-author">
                  @{post.author}
                </Link>
                <span className="post-category">{post.category}</span>
              </div>

              <h2 className="post-title">
                <a
                  href={`https://steemit.com${post.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.title}
                </a>
              </h2>

              <div className="post-body">
                {post.body?.substring(0, 200) || ''}
                {(post.body?.length || 0) > 200 && '...'}
              </div>

              <div className="post-footer">
                <div className="post-stats">
                  <span className="post-stat">
                    💰 {formatAsset(post.pending_payout_value)}
                  </span>
                  <span className="post-stat">
                    👍 {post.net_votes || 0} votes
                  </span>
                  <span className="post-stat">
                    💬 {post.children || 0} replies
                  </span>
                </div>
                <div className="post-time">
                  {new Date(post.created + 'Z').toLocaleString('ko-KR')}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default PostsPage;
