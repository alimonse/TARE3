import React from 'react';

const AnomalyTrigger = ({ anomalyTrigger }) => {
  return (
    <div>
      <table className='table my-0 text-center'>
        <thead>
          <tr>
            <th>NOMBRE TABLA</th>
            <th>NOMBRE TRIGGER</th>
            <th>INSERCIÓN</th>
            <th>ELIMINACIÓN</th>
            <th>ACTUALIZACIÓN</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {anomalyTrigger.map((data, index) => (
            <tr key={index}>
              <td>{data.table_name}</td>
              <td>{data.trigger_name}</td>
              <td>{data.isinsert === 1 ? 'SI' : 'NO'}</td>
              <td>{data.isdelete === 1 ? 'SI' : 'NO'}</td>
              <td>{data.isupdate === 1 ? 'SI' : 'NO'}</td>
              <td>{data.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnomalyTrigger;
