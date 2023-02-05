export interface FileInfo {
    name: string;
    size: string;
    type: "photo" | "video" | "audio" | "document" | "zip" | "other"
    date: string; 
}

export interface IFileService {
    listAllFiles(): Promise<FileInfo[]>;
    getFile(id: string): Promise<FileInfo>;
    getDownloadUrl(filename: string): string;
}