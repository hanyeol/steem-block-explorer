import { Link, useNavigate } from 'react-router-dom';
import './BlockTable.css';

const BlockTable = ({
  columns,
  rows,
  rowKey,
  rowLink,
  emptyMessage = 'No data available',
  cellLink,
}) => {
  const navigate = useNavigate();
  const columnTemplate = columns.map((col) => col.width || '1fr').join(' ');

  const renderCells = (row, rowIndex) => (
    columns.map((col) => {
      const cellContent = col.render(row, rowIndex);
      const linkTarget = cellLink ? cellLink(col, row, rowIndex) : null;

      if (linkTarget) {
        return (
          <Link
            key={col.key || col.label}
            to={linkTarget}
            className={col.className}
          >
            {cellContent}
          </Link>
        );
      }

      return (
        <div
          key={col.key || col.label}
          className={col.className}
        >
          {cellContent}
        </div>
      );
    })
  );

  const renderRow = (row, rowIndex) => {
    const key = rowKey ? rowKey(row, rowIndex) : rowIndex;
    const link = rowLink ? rowLink(row, rowIndex) : null;
    const commonProps = {
      className: 'table-row',
      style: { '--block-table-template': columnTemplate },
    };

    if (link) {
      return (
        <div
          key={key}
          {...commonProps}
          onClick={(e) => {
            // If the clicked element is a link or inside a link, don't navigate
            if (e.target.tagName === 'A' || e.target.closest('a')) {
              return;
            }
            navigate(link);
          }}
          style={{
            ...commonProps.style,
            cursor: 'pointer',
          }}
        >
          {renderCells(row, rowIndex)}
        </div>
      );
    }

    return (
      <div key={key} {...commonProps}>
        {renderCells(row, rowIndex)}
      </div>
    );
  };

  return (
    <div className="blocks-table">
      <div
        className="table-header"
        style={{ '--block-table-template': columnTemplate }}
      >
        {columns.map((col) => (
          <div key={col.key || col.label}>{col.label}</div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="table-empty">{emptyMessage}</div>
      ) : (
        rows.map(renderRow)
      )}
    </div>
  );
};

export default BlockTable;
