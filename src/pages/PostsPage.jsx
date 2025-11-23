import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiscussions } from '../services/steemApi';
import { useTranslation } from '../i18n.jsx';
import { formatTimestampWithLocale } from '../utils/format';
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

// Helper function to get total payout (pending or already paid)
const getTotalPayout = (post) => {
  // If pending payout exists and is not zero, show it
  const pending = parseFloat(post.pending_payout_value || '0');
  if (pending > 0) {
    return formatAsset(post.pending_payout_value);
  }

  // Otherwise show total payout (author + curator rewards)
  const total = parseFloat(post.total_payout_value || '0');
  const curator = parseFloat(post.curator_payout_value || '0');

  if (total + curator > 0) {
    // Show combined payout
    return formatAsset(post.total_payout_value);
  }

  return '$0.00';
};

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');
  const { t, language } = useTranslation();

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
    return <div className="posts-loading">{t('posts.loading')}</div>;
  }

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1 className="posts-title">{t('posts.title')}</h1>
        <div className="sort-buttons">
          <button
            className={`sort-button ${sortBy === 'trending' ? 'active' : ''}`}
            onClick={() => setSortBy('trending')}
          >
            🔥 {t('posts.trending')}
          </button>
          <button
            className={`sort-button ${sortBy === 'created' ? 'active' : ''}`}
            onClick={() => setSortBy('created')}
          >
            🆕 {t('posts.latest')}
          </button>
          <button
            className={`sort-button ${sortBy === 'hot' ? 'active' : ''}`}
            onClick={() => setSortBy('hot')}
          >
            ⚡ {t('posts.hot')}
          </button>
        </div>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>{t('posts.empty')}</p>
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
                    💰 {getTotalPayout(post)}
                  </span>
                  <span className="post-stat">
                    👍 {post.net_votes || 0} {t('posts.votes')}
                  </span>
                  <span className="post-stat">
                    💬 {post.children || 0} {t('posts.replies')}
                  </span>
                </div>
                <div className="post-time">
                  {formatTimestampWithLocale(post.created, language)}
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
