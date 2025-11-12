
import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  trainTestSplitRatio?: number;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, trainTestSplitRatio }) => {
  const splitIndex = trainTestSplitRatio ? Math.floor(rows.length * (trainTestSplitRatio / 100)) : rows.length;
  
  return (
    <div className="overflow-x-auto rounded-lg bg-brand-gray-darker shadow">
      <table className="min-w-full text-sm text-left text-brand-gray">
        <thead className="bg-brand-gray-dark text-xs text-brand-gray-light uppercase tracking-wider">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3">
                {header.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isTrain = rowIndex < splitIndex;
            const rowClass = trainTestSplitRatio
              ? isTrain 
                ? 'bg-blue-900/30 border-blue-500/30' 
                : 'bg-green-900/30 border-green-500/30'
              : 'bg-brand-gray-darker';

            return (
              <tr key={rowIndex} className={`${rowClass} border-b border-brand-gray-dark hover:bg-brand-gray-dark/50 transition-colors duration-200`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 font-mono">
                    {typeof cell === 'number' ? cell.toFixed(2) : cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
