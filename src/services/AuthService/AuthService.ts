import { AuthServiceProvider } from "./AuthServiceProvider";
import { IAuthService } from "./IAuthService";

export class AuthService {
    private static instance: IAuthService;

    private constructor() {}

    public static getInstance(): IAuthService {
        if (!AuthService.instance) {
            throw new Error("AuthService: Service has not been initialized.")
        }
        return AuthService.instance;
    }

    public static initialize(): void {
        AuthService.instance = new AuthServiceProvider();
    }
}