import React from 'react'
import { SoundOutlined, VideoCameraOutlined, FileTextOutlined, FileImageOutlined, FileZipOutlined, FileUnknownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FileInfo } from '../../services/FileService/IFileService'
import './FileInfoCard.scss'
import { FileService } from '../../services/FileService/FileService';


export default class FileInfoCard extends React.Component<FileInfo, any> {


    buildURL(filename: string) {
        const url = FileService.getInstance().getDownloadUrl(filename);
        return url;
    }

    render() {
        const { name, size, type, date } = this.props
        return (
            <a target="_blank" rel="noreferrer" download href={this.buildURL(name)}>
                <div className='file-info-card'>
                    <div className='file-type-image-container'>
                        {type === 'audio' && <SoundOutlined className='file-type-icon audio' />}
                        {type === 'video' && <VideoCameraOutlined className='file-type-icon video' />}
                        {type === 'document' && <FileTextOutlined className='file-type-icon document' />}
                        {type === 'photo' && <FileImageOutlined className='file-type-icon photo' />}
                        {type === 'zip' && <FileZipOutlined className='file-type-icon zip' />}
                        {type === 'other' && <FileUnknownOutlined className='file-type-icon other' />}
                    </div>
                    <div className='file-info-container'>
                        <div className='file-name'>{name}</div>
                        <div className='file-meta-container'>
                            <div className='file-size'>{size}</div>
                            <div className='file-created'>{moment(date).fromNow()}</div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }
}
