import { AuthService } from "../AuthService/AuthService";
import { NetworkCallService } from "../NetworkCallService/NetworkCallService";
import { URLService } from "../URLService/URLService";
import { FileInfo, IFileService } from "./IFileService";

export class FileServiceProvider implements IFileService {
  private APIEndpoint = URLService.getInstance().getBaseURL();

  listAllFiles(): Promise<FileInfo[]> {
    return new Promise((resolve, reject) => {
      NetworkCallService.getInstance().get(`${this.APIEndpoint}/files`)
        .then(async (resp) => {
          const filesArray = await resp.json()
          resolve(filesArray.files as FileInfo[]);
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

  getDownloadUrl(filename: string): string {
    const baseUrl = URLService.getInstance().generateURL(`/files/get`)
    const username = AuthService.getInstance().getLoggedInIUser().username;
    const encodedFileName = encodeURIComponent(`${username}/${filename}`)
    const url = `${baseUrl}?filename=${encodedFileName}`
    return url;
  }

}