import { Row, Col } from 'antd'
import React from 'react'
import FileInfoCard from '../../components/FileInfoCard/FileInfoCard'
import { FileService } from '../../services/FileService/FileService'
import { FileInfo } from '../../services/FileService/IFileService'
import { Toast } from '../../services/ToastNotificationService/Toast'

interface DashboardPageState {
  files: FileInfo[]
}
export default class DashboardPage extends React.Component<any, DashboardPageState> {

  constructor(props: any) {
    super(props);
    this.state = { files: [] }
  }

  componentDidMount(): void {
    FileService.getInstance().listAllFiles().then(files => this.setState({ files })).catch(error => Toast.error(error.message))
  }

  render() {
    const { files } = this.state
    return (
      <div>
        <Row gutter={16}>
          {files.map(file => <Col className="gutter-row" xxl={3} xl={4} lg={6} sm={8} md={6}><FileInfoCard {...file} /> </Col>)}
        </Row>
      </div>
    )
  }
}
