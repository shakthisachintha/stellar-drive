import { AuthService } from "../AuthService/AuthService";
import { INetworkCallService } from "./INetworkCallService";

export class NetworkCallServiceProvider implements INetworkCallService{
    delete(url: string, data: any): Promise<any> {
        return this.callHTTPFunction("delete", url, data);
    }

    post(url: string, data: any): Promise<any> {
        return this.callHTTPFunction("post", url, data);
    }

    put(url: string, data: any): Promise<any> {
        return this.callHTTPFunction("put", url, data);
    }

    get(url: string): Promise<any> {
        return this.callHTTPFunction("get", url, undefined);
    }
    
    private getSessionToken(): string {
        return AuthService.getInstance().getToken()
    }

    private getHeaders() {
        const headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
        };

        if (this.getSessionToken() !== ""){
            headers['x-auth-token'] = this.getSessionToken();
        }

        return headers;
    }

    private callHTTPFunction(method: "delete" | "post" | "get" | "put", url: string, data?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            fetch(url, {
                method: method,
                headers: this.getHeaders(),
                body: data ? JSON.stringify(data) : undefined
            }).then(async (response) => {
                resolve(response);
            }).catch(response => {reject(response)});
        });
    }
}