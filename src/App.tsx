import React from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import SiteFooter from './components/SiteFooter/SiteFooter';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import './App.scss';
import UploadPage from './pages/UploadPage/UploadPage';

function App() {

  return (
    <Layout>
      <BrowserRouter>
        <Navbar />
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/upload" component={UploadPage} />
            <Route path="*" component={ErrorPage} />
          </Switch>
        </Content>
        <SiteFooter />
      </BrowserRouter>
    </Layout>
  );
}

export default App;