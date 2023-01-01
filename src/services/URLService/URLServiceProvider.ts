import { IURLService } from "./IURLService";

export class URLServiceProvider implements IURLService {
    public getBaseURL(): string {
        return "http://localhost:3001/api";
    }

    public generateURL(path: string): string {
        return this.getBaseURL() + path;
    }
}
 