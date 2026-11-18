import React from 'react';
import { Outlet } from 'react-router-dom';

function Courses() {
  return (
    <div className="my-8 md:my-14 mx-3 sm:mx-6 md:mx-12 lg:mx-16 px-1 sm:px-4">
      <Outlet />
    </div>
  );
}

export default Courses;
