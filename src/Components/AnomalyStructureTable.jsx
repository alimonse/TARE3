import React from 'react';

const AnomalyStructureTable = ({ structureAnomaly }) => {
  return (
    <table className='table my-0 text-center'>
      <thead>
        <tr>
          <th>TABLA UNO</th>
          <th>TABLA DOS</th>
          <th>POSIBLE RELACIÓN</th>
          <th>ESQUEMA</th>
        </tr>
      </thead>
      <tbody>
        {structureAnomaly.map((data, index) => (
          <tr key={index}>
            <td>{data.TABLA_UNO}</td>
            <td>{data.TABLA_DOS}</td>
            <td>{data.POSIBLE_RELACION}</td>
            <td>{data.ESQUEMA}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnomalyStructureTable;
