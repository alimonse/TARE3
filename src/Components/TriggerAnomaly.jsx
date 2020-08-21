import React from 'react';

const TriggerAnomaly = ({ dataAnomalyTrigger }) => {
  let tabla = '';
  let campo = '';
  return (
    <table className='table my-0 text-center'>
      <thead>
        <tr>
          <th>NOMBRE TABLA</th>
          <th>ANOMALIA</th>
        </tr>
      </thead>
      <tbody>
        {dataAnomalyTrigger.map((data, id) => {
          const firstkey = Object.keys(data);
          if (id % 2 === 0) {
            tabla = data[`${firstkey[0]}`];
            campo = firstkey[0];
            return null;
          } else {
            return (
              <tr key={id}>
                <td>{data[`${firstkey[0]}`]}</td>
                <td>{`[${campo}] = ${tabla}`}</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
};

export default TriggerAnomaly;
