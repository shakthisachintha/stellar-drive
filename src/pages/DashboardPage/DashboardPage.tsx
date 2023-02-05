import { Row, Col, Divider, Spin } from 'antd'
import React from 'react'
import FileInfoCard from '../../components/FileInfoCard/FileInfoCard'
import { FileService } from '../../services/FileService/FileService'
import { FileInfo } from '../../services/FileService/IFileService'
import { Toast } from '../../services/ToastNotificationService/Toast'
import { LoadingOutlined } from '@ant-design/icons';
import './DashboardPage.scss'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface DashboardPageState {
  files: FileInfo[]
  loading: boolean
}
export default class DashboardPage extends React.Component<any, DashboardPageState> {

  constructor(props: any) {
    super(props);
    this.state = { files: [], loading: true }
  }

  componentDidMount(): void {
    this.getFiles()
  }

  async getFiles() {
    try {
      const resp = await FileService.getInstance().listAllFiles()
      const files = resp
      this.setState({ files, loading: false })
    } catch (error: any) {
      Toast.error(error.message)
    }
  }

  render() {
    const { files, loading } = this.state
    return (
      <div>
        <Row>
          <Col>
            <h1 className='header-one'>Dashboard</h1>
            <p>Here you can see all your uploaded files.</p>
          </Col>
        </Row>
        <Divider />
        {loading &&
          (<div style={{height:"50vh"}} className='loader-container'>
           <div><Spin indicator={antIcon} /></div>
          </div>)
        }
        <Row style={{ marginTop: '4rem', marginBottom: '2rem', width: "100%" }} justify={'center'} gutter={[16, 24]}>
          {files?.map(file => <Col key={Math.random().toString()} xxl={3} xl={4} lg={6} sm={8} md={6}><FileInfoCard {...file} /> </Col>)}
        </Row>
      </div>
    )
  }
}
