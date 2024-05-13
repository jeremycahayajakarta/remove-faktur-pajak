import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Faktur from "../pages/Faktur";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path={`/`} Component={Home} />
        <Route path={`/faktur`} Component={Faktur} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
