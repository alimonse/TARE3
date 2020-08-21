const {
  ANOMALY_QUERY,
  GET_ALLDB_QUERY,
  ANOMALY_TRIGGERS_QUERY,
  TABLAS_SIN_RELACIONES,
  ANOMALY_CUD_QUERY,
} = require('./query');
const conexion = 'mssql://user:password@localhost';

const anomalyAnalysis = async (res, sql, db) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(`use ${db} ${ANOMALY_QUERY}`);
    res.send(result);
  } catch (err) {
    res.status(404).send(err);
  }
};

const getAllDatabases = async (res, sql) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(GET_ALLDB_QUERY);
    res.send(result);
  } catch (err) {
    res.send(404);
  }
};

const getTriggerAnomalys = async (res, sql, db) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(`use ${db} ${ANOMALY_TRIGGERS_QUERY}`);
    res.send(result);
  } catch (err) {
    res.send(404);
  }
};

const unrelatedTables = async (res, sql, db) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(`use ${db} ${TABLAS_SIN_RELACIONES}`);
    res.send(result);
  } catch (err) {
    res.send(404);
  }
};

const anomalyCUD = async (res, sql, db) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(`use ${db} ${ANOMALY_CUD_QUERY}`);
    res.send(result);
  } catch (err) {
    res.send(404);
  }
};

const createDataBase = async (res, sql, data) => {
  try {
    await sql.connect(conexion);
    const result = await sql.query(data);
    console.log(result, 'res');
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

exports.anomalyAnalysis = anomalyAnalysis;
exports.getAllDatabases = getAllDatabases;
exports.getTriggerAnomalys = getTriggerAnomalys;
exports.unrelatedTables = unrelatedTables;
exports.anomalyCUD = anomalyCUD;
exports.createDataBase = createDataBase;
