import React from 'react'
import { SoundOutlined, VideoCameraOutlined, FileTextOutlined, FileImageOutlined, FileZipOutlined, FileUnknownOutlined } from '@ant-design/icons';
import { FileInfo } from '../../services/FileService/IFileService'
import moment from 'moment';
import './FileInfoCard.scss'


export default class FileInfoCard extends React.Component<FileInfo, any> {


    render() {
        const { name, size, type, uploadDate, url } = this.props
        return (
            <a target="_blank" rel="noreferrer" download href={url}>
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
                        <div className='file-size'>{size}Mb</div>
                        <div className='file-created'>{moment(uploadDate).fromNow()}</div>
                    </div>
                </div>
            </div>
            </a>
        )
    }
}
