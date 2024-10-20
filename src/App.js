import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Authentication from './Pages/Authentication';

function App() {
  const [params, setParams] = useState({});
  const location = useLocation(); // This hook tracks the current URL
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Whenever the location or searchParams changes, update the state with the query params
    const queryObject = Object.fromEntries([...searchParams]); // Converts search params to an object
    setParams(queryObject);
  }, [location, searchParams]);

  return (
    <Routes>
      <Route path="/" exact element={<LandingPage />} />
      <Route path="/login" exact element={<Authentication params={params} />} />
    </Routes>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter basename="/Kode-Skool">
      <App />
    </BrowserRouter>
  );
}
