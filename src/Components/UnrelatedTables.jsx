import React from 'react';

const UnrelatedTables = ({ unrelatedTable }) => {
  return (
    <table className='table my-0 text-center'>
      <thead>
        <tr>
          <th>NOMBRE TABLA</th>
        </tr>
      </thead>
      <tbody>
        {unrelatedTable.map((data, index) => (
          <tr key={index}>
            <td>{data.TABLAS_SIN_RELACIONES}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnrelatedTables;
