import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Login from './page/Login';
import NewMain from './page/NewMain';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/main">
            <NewMain />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>

  );
}

export default App;
