import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { AuthService } from '../../services/AuthService/AuthService';
import { Toast } from '../../services/ToastNotificationService/Toast';

const { Dragger } = Upload;

export default class UploadPage extends React.Component {
    render() {
        const props: UploadProps = {
            name: 'file',
            headers:{
                "x-auth-token": AuthService.getInstance().getToken()
            },
            multiple: false,
            action: 'http://localhost:3001/api/files',
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
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>
            </div>
        );
    }
}