import { Link } from 'react-router-dom';

const DetailLayout = ({
  title,
  backTo = '/',
  onBack,
  actions,
  className = '',
  children,
}) => {
  const renderBackButton = () => {
    if (onBack) {
      return (
        <button type="button" className="back-button" onClick={onBack}>
          ← Back
        </button>
      );
    }

    return (
      <Link to={backTo} className="back-button">
        ← Back
      </Link>
    );
  };

  return (
    <div className={`detail-page ${className}`.trim()}>
      <div className="navigation">
        {renderBackButton()}
        {actions ? <div className="navigation-actions">{actions}</div> : null}
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default DetailLayout;
