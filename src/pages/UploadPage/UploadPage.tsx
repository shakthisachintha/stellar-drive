import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Col, Divider, Row, UploadProps } from 'antd';
import { Upload } from 'antd';
import { AuthService } from '../../services/AuthService/AuthService';
import { Toast } from '../../services/ToastNotificationService/Toast';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../configs';

const { Dragger } = Upload;

export default class UploadPage extends React.Component {
    render() {
        const url = CONFIG.BACKEND_URL + '/api/files';
        const props: UploadProps = {
            name: 'file',
            headers: {
                "x-auth-token": AuthService.getInstance().getToken()
            },
            multiple: true,
            action: url,
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    Toast.success("Upload Success", `${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    Toast.error("Upload Error", `${info.file.name} file upload failed.`);
                }
            },
            onDrop(e) {
                console.log('Dropped files', e.dataTransfer.files);
            },
        };

        return (
            <div style={{height: '75vh'}}>
                <Row>
                    <Col>
                        <h1 className='header-one'>Upload Files</h1>
                        <p>Upload any file to your personal cloud storage.</p>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Divider></Divider>
                    </Col>
                </Row>


                <Row>
                    <Col style={{marginTop: "2rem", marginBottom:"2rem"}} span={24}>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                brand files. Please upload only files that you own.
                            </p>
                        </Dragger>
                    </Col>
                </Row>

                <Row justify={'center'}>
                    <Col>
                        <p style={{color: 'gray'}}>Goto <Link to={'/dashboard'} >Dashboard</Link> to view uploaded files.</p>
                    </Col>
                </Row>
            </div>
        );
    }
}