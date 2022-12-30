import { AuthService } from "./AuthService/AuthService";

export class ServiceRegistry {
    static init() {
        AuthService.initialize();
    }
}