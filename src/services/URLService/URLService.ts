import { IURLService } from "./IURLService";
import { URLServiceProvider } from "./URLServiceProvider";

export class URLService {
  private static instance: IURLService;

  private constructor() {}

  public static getInstance(): IURLService {
    if (!URLService.instance) {
      throw new Error("URLService: Service has not been initialized.");
    }
    return URLService.instance;
  }

  public static initialize(): void {
    URLService.instance = new URLServiceProvider();
  }
}
