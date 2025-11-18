import './SkeletonLoader.css';

export const BlockListSkeleton = () => {
  return (
    <div className="block-list">
      <div className="block-header">
        <h2>Latest Blocks</h2>
        <div className="latest-block-info">
          <span className="skeleton skeleton-text skeleton-latest"></span>
        </div>
      </div>

      <table className="block-table">
        <thead>
          <tr>
            <th>Block Number</th>
            <th>Timestamp</th>
            <th>Transactions</th>
            <th>Witness</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(20)].map((_, index) => (
            <tr key={index}>
              <td>
                <span className="skeleton skeleton-text skeleton-block-num"></span>
              </td>
              <td>
                <span className="skeleton skeleton-text skeleton-timestamp"></span>
              </td>
              <td>
                <span className="skeleton skeleton-text skeleton-tx-count"></span>
              </td>
              <td>
                <span className="skeleton skeleton-text skeleton-witness"></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const BlockDetailSkeleton = () => {
  return (
    <div className="block-detail">
      <div className="navigation">
        <span className="skeleton skeleton-text skeleton-back-button"></span>
        <div className="block-navigation">
          <span className="skeleton skeleton-text skeleton-nav-button"></span>
          <span className="skeleton skeleton-text skeleton-nav-button"></span>
        </div>
      </div>

      <h2>
        <span className="skeleton skeleton-text skeleton-title"></span>
      </h2>

      <div className="block-info">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="info-row">
            <span className="skeleton skeleton-text skeleton-label"></span>
            <span className="skeleton skeleton-text skeleton-value"></span>
          </div>
        ))}
      </div>

      <h3>
        <span className="skeleton skeleton-text skeleton-subtitle"></span>
      </h3>

      <div className="transactions">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="transaction">
            <div className="tx-header">
              <span className="skeleton skeleton-text skeleton-tx-index"></span>
              <span className="skeleton skeleton-text skeleton-tx-ops"></span>
            </div>
            <div className="skeleton skeleton-box skeleton-operations"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
