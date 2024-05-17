import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Faktur from "../pages/Faktur";
import MainLayout from "../layouts/MainLayout";
import Log from "../pages/Log";

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route exact path={`/`} Component={Home} />
          <Route path={`/faktur`} Component={Faktur} />
          <Route path={`/log`} Component={Log} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
