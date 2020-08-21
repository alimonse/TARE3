import React from 'react';
import NavSideBar from './NavSideBar';
import CreateDataBase from './CreateDataBase';
import AnomalyAnalysis from './AnomalyAnalysis';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div id='wrapper'>
        <NavSideBar />
        <div className='d-flex flex-column' id='content-wrapper'>
          <div id='content'>
            <br />
            <Switch>
              <Route exact path='/' component={CreateDataBase} />
              <Route path='/analisis' component={AnomalyAnalysis} />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
