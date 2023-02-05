import React from 'react'
import { Row, Col, Button } from 'antd'
import Title from 'antd/es/typography/Title'
import { asset } from '../../assets'
import { MobileOutlined, FileProtectOutlined, ShareAltOutlined, PlayCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import './LandingPage.scss'
import { AuthService } from '../../services/AuthService/AuthService';
import { Link } from 'react-router-dom';

export default class LandingPage extends React.Component {
  render() {

    const isLoggedIn = AuthService.getInstance().isLoggedIn();

    return (
      <>
        <Row className='header-row' align={'middle'} justify={'space-between'}>
          <Col>
            <Title className='heading-text'>Stellar Drive</Title>
            <Title className='sub-heading-text' level={5}>Stellar drive is a cloud storage platform that uses AWS S3 buckets to store your data.</Title>
            {!isLoggedIn && <Link to={'/login'}><Button type="default" icon={<PlayCircleOutlined />} style={{marginRight: 10}} size={'large'} value={"Get Started"}> Get Started </Button></Link>}
            {isLoggedIn && <Link to={'/dashboard'}><Button type="primary" icon={<DashboardOutlined />} size={'large'} value={"Get Started"}> Dashboard </Button></Link>}
          </Col>
          <Col>
            <img className='banner-image' src={asset.images.coverPng} alt="stellar drive logo" />
          </Col>
        </Row>

        <Row justify={'center'} style={{paddingTop: 10, paddingBottom: 0}}>
          <Col>
            <Title style={{marginBottom: 0}}>Organized. Protected. Connected.</Title>
          </Col>
        </Row>

        <Row className='content-row' justify={'space-between'}>
          <Col span={6} className='content-col'>
            <div className='info-card'>
              <MobileOutlined className='info-card-icon' />
              <Title level={3} className='heading'>Anywhere access</Title>
              <Title level={5} className='sub-heading'>Enjoy the freedom to access, edit, and share your files on all your devices, wherever you are.</Title>
            </div>
          </Col>

          <Col span={6} className='content-col'>
            <div className='info-card'>
              <FileProtectOutlined className='info-card-icon' />
              <Title level={3} className='heading'>Back up and protect</Title>
              <Title level={5} className='sub-heading' >If you lose your device, you won’t lose your files and photos when they’re saved in Stellar Drive.</Title>
            </div>
          </Col>

          <Col span={6} className='content-col'>
            <div className='info-card'>
              <ShareAltOutlined className='info-card-icon' />
              <Title level={3} className='heading'>Share and collaborate</Title>
              <Title level={5} className='sub-heading'>Stay connected, share your documents and photos with friends and family, and collaborate in real time with Stellar apps.</Title>
            </div>
          </Col>
        </Row>
      </>
    )
  }
}
