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
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  const [hasMore, setHasMore] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await getDiscussions(sortBy, { limit: 20 });
        setPosts(postsData);
        setHasMore(postsData.length >= 20);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortBy]);

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore || posts.length === 0) return;

    setLoadingMore(true);
    try {
      const lastPost = posts[posts.length - 1];
      const morePosts = await getDiscussions(sortBy, {
        limit: 20,
        start_author: lastPost.author,
        start_permlink: lastPost.permlink
      });

      // Remove the first item if it's a duplicate
      const newPosts = morePosts.filter((post, index) => {
        if (index === 0) {
          return post.author !== lastPost.author || post.permlink !== lastPost.permlink;
        }
        return true;
      });

      setPosts([...posts, ...newPosts]);
      setHasMore(newPosts.length >= 20);
      setLoadingMore(false);
    } catch (error) {
      console.error('Failed to load more posts:', error);
      setLoadingMore(false);
    }
  };

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
                    👍 {post.active_votes?.filter(v => v.rshares !== "0" && v.rshares !== 0).length || 0} {t('posts.votes')}
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

      {hasMore && posts.length > 0 && (
        <div className="load-more-container">
          <button
            className="load-more-button"
            onClick={loadMorePosts}
            disabled={loadingMore}
          >
            {loadingMore ? t('posts.loadingMore') : t('posts.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}

export default PostsPage;
