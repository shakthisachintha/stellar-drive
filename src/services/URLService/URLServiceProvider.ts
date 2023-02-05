import { CONFIG } from "../../configs";
import { IURLService } from "./IURLService";

export class URLServiceProvider implements IURLService {
    public getBaseURL(): string {
        return CONFIG.BACKEND_URL + "/api";
    }

    public generateURL(path: string): string {
        return this.getBaseURL() + path;
    }
}