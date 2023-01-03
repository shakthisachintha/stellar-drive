export interface FileInfo {
    id: string
    name: string;
    url: string;
    size: number;
    type: "photo" | "video" | "audio" | "document" | "zip" | "other"
    uploadDate: string; 
}

export interface IFileService {
    listAllFiles(): Promise<FileInfo[]>;
    getFile(id: string): Promise<FileInfo>;
    downloadFile(id: string): Promise<void>;
}