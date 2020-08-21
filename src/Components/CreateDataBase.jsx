import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';

const CreateDataBase = () => {
  const [SQLQuery, setSQLQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/createdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: SQLQuery,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='card shadow mb-4'>
          <div className='card-header justify-content-between align-items-center'>
            <h6 className='text-primary text-center font-weight-bold'>
              CREAR BASE DE DATOS
            </h6>
          </div>
          <div className='card-body'>
            <p className='text-primary font-weight-bold'>
              Insertar un Script SQL para crear la Base de Datos
            </p>
            <DragAndDrop sql={setSQLQuery} />
            <br />
            <form onSubmit={handleSubmit}>
              <div className='form-group text-center'>
                <button className='btn btn-primary'>Crear Base de Datos</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDataBase;
