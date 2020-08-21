let {
  anomalyAnalysis,
  getAllDatabases,
  getTriggerAnomalys,
  unrelatedTables,
  anomalyCUD,
  createDataBase,
} = require('./database');
let express = require('express');
let sql = require('mssql');
let cors = require('cors');
let app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));
app.use(cors()); // CORS Middleware

app.post('/createdb', (req, res) => {
  createDataBase(res, sql, req.body);
});
app.post('/anomalydb', (req, res) => {
  anomalyAnalysis(res, sql, req.body.db);
});
app.get('/getdbs', (req, res) => {
  getAllDatabases(res, sql);
});
app.post('/triggeranomalis', (req, res) => {
  getTriggerAnomalys(res, sql, req.body.db);
});

app.post('/unrelatedtables', (req, res) => {
  unrelatedTables(res, sql, req.body.db);
});

app.post('/cudquery', (req, res) => {
  anomalyCUD(res, sql, req.body.db);
});

app.listen(5000, function () {
  console.log('Server is running on PORT 5000');
});
