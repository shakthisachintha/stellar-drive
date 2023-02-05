import { Col, Layout, Row } from 'antd';
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

const MainWrapper = (props: any) => {
  return (
    <Row align={'middle'} justify={'center'}>
      <Col className='main-wrapper' span={20}>
        {props.children}
      </Col>
    </Row>
  );
}

const DashboardPageComponent = (props: any) => <MainWrapper><DashboardPage {...props} /></MainWrapper>;
const LoginPageComponent = (props: any) => <MainWrapper><LoginPage {...props} /></MainWrapper>;
const UploadPageComponent = (props: any) => <MainWrapper><UploadPage {...props} /></MainWrapper>;
const ErrorPageComponent = (props: any) => <MainWrapper><ErrorPage {...props} /></MainWrapper>;

function App() {

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <BrowserRouter>
        <Navbar />
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/dashboard" component={DashboardPageComponent} />
            <Route exact path="/login" component={LoginPageComponent} />
            <Route exact path="/upload" component={UploadPageComponent} />
            <Route path="*" component={ErrorPageComponent} />
          </Switch>
        </Content>
        <SiteFooter />
      </BrowserRouter>
    </Layout>
  );
}

export default App;