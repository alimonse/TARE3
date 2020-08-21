import React, { useState, useEffect } from 'react';
import DataAnomalyTable from './DataAnomalyTable';
import AnomalyStructureTable from './AnomalyStructureTable';
import UnrelatedTables from './UnrelatedTables';
import AnomalyTrigger from './AnomalyTrigger';
import TriggerAnomaly from './TriggerAnomaly';
import LogsButton from './LogsButton';

const AnomalyAnalysis = () => {
  const [databases, setDatabases] = useState([]);
  const [database, setDatabase] = useState('');
  const [dataAnomaly, setdataAnomaly] = useState([]);
  const [structureAnomaly, setStructureAnomaly] = useState([]);
  const [isDataAnomaly, setIsDataAnomaly] = useState(false);
  const [isStructureAnomaly, setIsStructureAnomaly] = useState(false);
  const [visibility, setVisibility] = useState('hidden');
  const [unrelatedTable, setUnrelatedTable] = useState([]);
  const [isUnrelatedTable, setIsUnrelatedTable] = useState(false);
  const [anomalyTrigger, setAnomalyTrigger] = useState([]);
  const [isAnomalyTrigger, setIsAnomalyTrigger] = useState(false);
  const [dataAnomalyTrigger, setdataAnomalyTrigger] = useState([]);
  const [isDataAnomalyTrigger, setIsDataAnomalyTrigger] = useState(false);

  const getDatabases = async () => {
    const res = await fetch('http://localhost:5000/getdbs');
    const databases = await res.json();
    setDatabase(databases.recordset[0].name);
    setDatabases(databases.recordset);
  };

  const handleDropDown = (e) => {
    setDatabase(e.target.value);
    setIsDataAnomaly(false);
    setIsStructureAnomaly(false);
    setIsUnrelatedTable(false);
    setIsAnomalyTrigger(false);
    setIsDataAnomalyTrigger(false);
    setdataAnomaly([]);
    setStructureAnomaly([]);
    setUnrelatedTable([]);
    setAnomalyTrigger([]);
    setdataAnomalyTrigger([]);
  };

  const getTriggerAnpmaly = async () => {
    try {
      const res = await fetch('http://localhost:5000/triggeranomalis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ db: database }),
      });
      const anomaly = await res.json();
      if (anomaly.recordsets.flat().length !== 0) {
        setdataAnomalyTrigger(anomaly.recordsets.flat());
        setIsDataAnomalyTrigger(true);
      } else {
        setIsDataAnomalyTrigger(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUnrelatedTables = async () => {
    try {
      const res = await fetch('http://localhost:5000/unrelatedtables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ db: database }),
      });
      const anomaly = await res.json();
      if (anomaly.recordsets.flat().length !== 0) {
        setUnrelatedTable(anomaly.recordsets.flat());
        setIsUnrelatedTable(true);
      } else {
        setIsUnrelatedTable(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAnomaliasTriggers = async () => {
    try {
      const res = await fetch('http://localhost:5000/cudquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ db: database }),
      });
      const anomaly = await res.json();
      if (anomaly.recordsets.flat().length !== 0) {
        setAnomalyTrigger(anomaly.recordsets.flat());
        setIsAnomalyTrigger(true);
      } else {
        setIsAnomalyTrigger(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibility('visible');
    try {
      const res = await fetch('http://localhost:5000/anomalydb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ db: database }),
      });
      const anomaly = await res.json();
      if (anomaly.recordsets.length === 0) {
        //return setFillTables(false);
      }

      const dataAnomaly = anomaly.recordsets
        .slice(0, anomaly.recordsets.length / 2)
        .flat();
      const structureAnomaly = anomaly.recordsets
        .slice(anomaly.recordsets.length / 2, anomaly.recordsets.length)
        .flat();

      if (dataAnomaly.length !== 0) {
        setdataAnomaly(dataAnomaly);
        setIsDataAnomaly(true);
      } else {
        setIsDataAnomaly(false);
      }
      if (structureAnomaly.length !== 0) {
        setStructureAnomaly(structureAnomaly);
        setIsStructureAnomaly(true);
      } else {
        setIsStructureAnomaly(false);
      }
      getUnrelatedTables();
      checkAnomaliasTriggers();
      getTriggerAnpmaly();
      setVisibility('hidden');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDatabases();
  }, []);

  return (
    <>
      <div className='container-fluid'>
        <div className='card shadow mb-4'>
          <div className='card-header justify-content-between align-items-center'>
            <h6 className='text-primary text-center font-weight-bold'>
              ANÁLISIS DE ANOMALÍAS
            </h6>
          </div>
          <div className='card-body'>
            <br />
            <form onSubmit={handleSubmit}>
              <label>Seleccione una Base de Datos</label>
              <div className='input-group-append'>
                <select
                  onChange={handleDropDown}
                  className='form-control form-control-sm custom-select custom-select-sm col-md-3'
                >
                  {databases.map((db) => (
                    <option key={db.name} value={db.name}>
                      {db.name}
                    </option>
                  ))}
                </select>
                <div className='input-group-append'>
                  <button className='btn btn-primary py-0'>
                    <i className='fas fa-search' />
                  </button>
                </div>
              </div>
            </form>
            <br />
            <div className='text-center' style={{ visibility: visibility }}>
              <div className='spinner-border text-primary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>

            {isDataAnomaly ? (
              <>
                <br />
                <div className='text-center'>
                  <label className='text-primary'>
                    <b>
                      {`ANOMALÍAS DE DATOS ENCONTRADAS EN LA BASE DE DATOS ${database.toUpperCase()}`}
                    </b>
                  </label>
                </div>
                <DataAnomalyTable dataAnomaly={dataAnomaly} />{' '}
              </>
            ) : null}

            {isAnomalyTrigger ? (
              <>
                <br />
                <div className='text-center'>
                  <label className='text-primary'>
                    <b>
                      {`TABLAS CON TRIGGERS CON ANOMALÍAS EN LA BASE DE DATOS ${database.toUpperCase()}`}
                    </b>
                  </label>
                </div>
                <AnomalyTrigger anomalyTrigger={anomalyTrigger} />
              </>
            ) : null}

            {isDataAnomalyTrigger ? (
              <>
                <br />
                <TriggerAnomaly dataAnomalyTrigger={dataAnomalyTrigger} />{' '}
              </>
            ) : null}

            {isUnrelatedTable ? (
              <>
                <br />
                <div className='text-center'>
                  <label className='text-primary'>
                    <b>
                      {`TABLAS SIN RELACIONES EN LA BASE DE DATOS ${database.toUpperCase()}`}
                    </b>
                  </label>
                </div>
                <UnrelatedTables unrelatedTable={unrelatedTable} />
              </>
            ) : null}

            {isStructureAnomaly ? (
              <>
                <br />
                <div className='text-center'>
                  <label className='text-primary'>
                    <b>
                      {`RELACIONES QUE REQUIEREN POSIBLE INTEGRIDAD REFERENCIAL EN LA BASE DE DATOS ${database.toUpperCase()}`}
                    </b>
                  </label>
                </div>
                <AnomalyStructureTable structureAnomaly={structureAnomaly} />
              </>
            ) : null}
          </div>
          <LogsButton
            isDataAnomaly={isDataAnomaly}
            isStructureAnomaly={isStructureAnomaly}
            isUnrelatedTable={isUnrelatedTable}
            isAnomalyTrigger={isAnomalyTrigger}
            isDataAnomalyTrigger={isDataAnomalyTrigger}
            dataAnomaly={dataAnomaly}
            structureAnomaly={structureAnomaly}
            anomalyTrigger={anomalyTrigger}
            dataAnomalyTrigger={dataAnomalyTrigger}
            unrelatedTable={unrelatedTable}
          />
        </div>
      </div>
    </>
  );
};

export default AnomalyAnalysis;
