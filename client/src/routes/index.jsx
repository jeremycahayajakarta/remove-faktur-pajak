import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Faktur from "../pages/Faktur";
import Layout from "../layouts/Layout";
import Log from "../pages/Log";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path={`/`} Component={Home} />
          <Route path={`/faktur`} Component={Faktur} />
          <Route path={`/log`} Component={Log} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
