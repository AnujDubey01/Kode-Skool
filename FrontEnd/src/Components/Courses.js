import React from 'react'
import { Outlet } from 'react-router-dom';
import './Courses.css';

function Courses() {
  return (
    <>
        <div className="courseContainer">
            <Outlet />
        </div>
    </>
  )
}

export default Courses