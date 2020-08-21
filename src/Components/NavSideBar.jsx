import React from 'react';
import {Link} from 'react-router-dom'

function NavSideBar() {
  return (
    <>
      <nav className='navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0'>
        <div className='container-fluid d-flex flex-column p-0'>
          <a
            className='navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0'
            href='/'
          >
            <div className='sidebar-brand-icon'>
              <i className='fas fa-database' />
            </div>
            <div className='sidebar-brand-text mx-3'>
              <span>TAREA 3</span>
            </div>
          </a>
          <hr className='sidebar-divider my-0' />
          <ul className='nav navbar-nav text-light' id='accordionSidebar'>
            <li className='nav-item' role='presentation'>
              <Link className='nav-link' to='/'>
                <i className='fas fa-tachometer-alt' />
                <span>Crear Base de Datos</span>
              </Link>
            </li>
            <li className='nav-item' role='presentation'>
              <Link className='nav-link' to='/analisis'>
                <i className='fas fa-chart-pie' />
                <span>Análisis de Anomalías</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavSideBar;
