/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

const LogsButton = ({
  isDataAnomaly,
  isStructureAnomaly,
  isUnrelatedTable,
  isAnomalyTrigger,
  isDataAnomalyTrigger,
  dataAnomaly,
  structureAnomaly,
  anomalyTrigger,
  dataAnomalyTrigger,
  unrelatedTable,
}) => {
  const [isInfo, setIsInfo] = useState(false);

  const verifyInfo = () => {
    if (
      isDataAnomaly ||
      isStructureAnomaly ||
      isUnrelatedTable ||
      isAnomalyTrigger ||
      isDataAnomalyTrigger
    ) {
      setIsInfo(true);
    } else {
      setIsInfo(false);
    }
  };

  const hadleLogs = (e) => {
    e.preventDefault();
    if (isDataAnomaly || isAnomalyTrigger || isDataAnomalyTrigger) {
      const element = document.createElement('a');
      let data = '';
      if (isDataAnomaly) {
        data += String(JSON.stringify(dataAnomaly)) + '\n';
      }
      if (isAnomalyTrigger) {
        data += String(JSON.stringify(anomalyTrigger)) + '\n';
      }
      if (isDataAnomalyTrigger) {
        data += String(JSON.stringify(dataAnomalyTrigger)) + '\n';
      }
      const file = new Blob([data], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'Anomalias_De_Datos.txt';
      document.body.appendChild(element);
      element.click();
    }

    if (isStructureAnomaly || isUnrelatedTable) {
      const element = document.createElement('a');
      let data = '';
      if (isStructureAnomaly) {
        data += String(JSON.stringify(structureAnomaly)) + '\n';
      }
      if (isUnrelatedTable) {
        data += String(JSON.stringify(unrelatedTable)) + '\n';
      }
      const file = new Blob([data], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'Anomalias_De_Integridad.txt';
      document.body.appendChild(element);
      element.click();
    }
  };

  useEffect(() => {
    verifyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDataAnomaly,
    isStructureAnomaly,
    isUnrelatedTable,
    isDataAnomalyTrigger,
    isAnomalyTrigger,
  ]);
  return (
    <>
      {isInfo ? (
        <button type='button' className='btn btn-primary' onClick={hadleLogs}>
          Generar Logs
        </button>
      ) : null}
    </>
  );
};

export default LogsButton;
