import React from 'react';

const DataAnomalyTable = ({ dataAnomaly }) => {
  return (
    <table className='table my-0 text-center'>
      <thead>
        <tr>
          <th>NOMBRE TABLA</th>
          <th>NOMBRE CONSTRAINT</th>
          <th>ANOMALIA</th>
          <th>ESQUEMA</th>
        </tr>
      </thead>
      <tbody>
        {dataAnomaly.map((data, index) => (
          <tr key={index}>
            <td>{data.NOMBRE_TABLA}</td>
            <td>{data.NOMBRE_CONSTRAINT}</td>
            <td>{data.ANOMALIA}</td>
            <td>{data.ESQUEMA}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataAnomalyTable;
