import { FileServiceProvider } from "./FileServiceProvider";
import { IFileService } from "./IFileService";


export class FileService {
    private static instance: IFileService;

    private constructor() {}

    public static getInstance(): IFileService {
        if (!FileService.instance) {
            throw new Error("FileService: Service has not been initialized.")
        }
        return FileService.instance;
    }

    public static initialize(): void {
        FileService.instance = new FileServiceProvider();
    }
}