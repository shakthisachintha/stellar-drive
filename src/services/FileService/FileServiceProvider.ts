import { NetworkCallService } from "../NetworkCallService/NetworkCallService";
import { URLService } from "../URLService/URLService";
import { FileInfo, IFileService } from "./IFileService";

export class FileServiceProvider implements IFileService {
    private APIEndpoint = URLService.getInstance().getBaseURL();

    listAllFiles(): Promise<FileInfo[]> {
        return new Promise((resolve, reject) => {
            NetworkCallService.getInstance().get(`${this.APIEndpoint}/files`)
                .then((files: FileInfo[]) => {
                    files = [{
                        id: '1',
                        name: 'batch_photo.jpg',
                        size: 10.24,
                        type: 'photo',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }, {
                        id: '2',
                        name: 'recorind1.mp3',
                        size: 10.24,
                        type: 'audio',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      },
                      {
                        id: '3',
                        name: 'song-2.mp4',
                        size: 101.24,
                        type: 'video',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }, {
                        id: '4',
                        name: 'batch_photo.jpg',
                        size: 10.24,
                        type: 'photo',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }, {
                        id: '5',
                        name: 'batch_photo.jpg',
                        size: 10.24,
                        type: 'other',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }, {
                        id: '6',
                        name: 'batch_photo.jpg',
                        size: 10.24,
                        type: 'document',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }, {
                        id: '7',
                        name: 'batch_photo.jpg',
                        size: 10.24,
                        type: 'zip',
                        uploadDate: new Date().toISOString(),
                        url: 'https://www.africau.edu/images/default/sample.pdf'
                      }]
                    resolve(files);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    getFile(id: string): Promise<FileInfo> {
        return new Promise((resolve, reject) => {
            NetworkCallService.getInstance().get(`${this.APIEndpoint}/files/${id}`)
                .then((file: FileInfo) => {
                    resolve(file);
                })
                .catch((error) => {
                    reject(error);
                })
        });
    }

    downloadFile(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}