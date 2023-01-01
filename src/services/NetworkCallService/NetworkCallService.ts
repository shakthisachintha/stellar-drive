import { INetworkCallService } from "./INetworkCallService";
import { NetworkCallServiceProvider } from "./NetworkCallServiceProvider";

export class NetworkCallService {
    private static instance: INetworkCallService;

    private constructor() {}

    public static getInstance(): INetworkCallService {
        if (!NetworkCallService.instance) {
            throw new Error("NetworkCallService: Service has not been initialized.")
        }
        return NetworkCallService.instance;
    }

    public static initialize(): void {
        NetworkCallService.instance = new NetworkCallServiceProvider();
    }
}