import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestPosts } from '../services/steemApi';
import './PostList.css';

const PostList = ({ limit = 10 }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getLatestPosts(limit);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch latest posts:', err);
        setError('Failed to load latest posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    // Steem API returns UTC timestamps, add 'Z' to ensure UTC parsing
    const postTime = new Date(timestamp + 'Z');
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const truncateBody = (body, maxLength = 150) => {
    if (body.length <= maxLength) return body;
    return body.substring(0, maxLength) + '...';
  };

  const handleAccountClick = (author) => {
    navigate(`/account/${author}`);
  };

  if (loading) {
    return (
      <div className="post-list">
        <h2>Latest Posts</h2>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list">
        <h2>Latest Posts</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-list">
        <h2>Latest Posts</h2>
        <div className="info">No posts found on this blockchain yet.</div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>Latest Posts</h2>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={`${post.author}-${post.permlink}`} className="post-item">
            <div className="post-header">
              <span
                className="post-author"
                onClick={() => handleAccountClick(post.author)}
              >
                @{post.author}
              </span>
              <span className="post-time">{formatTimeAgo(post.created)}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{truncateBody(post.body)}</p>
            <div className="post-stats">
              <span className="stat">
                <span className="stat-icon">💬</span> {post.children}
              </span>
              <span className="stat">
                <span className="stat-icon">👍</span> {post.net_votes}
              </span>
              <span className="stat">
                <span className="stat-icon">💰</span> ${parseFloat(post.pending_payout_value).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
