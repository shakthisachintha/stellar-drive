import { Observable } from "rxjs";

export interface AuthState {
  isLoggedIn: boolean;
  user: {
    username?: string;
    name?: string;
    token?: string;
  };
}

export interface IAuthService {
  getLoggedInStateObserver(): Observable<AuthState>;
  isLoggedIn(): boolean;
  login(userName: string, password: string): Promise<any>;
  logout(): Promise<any>;
  register(userName: string, password: string, name: string, email: string): Promise<any>;
  refreshToken(): Promise<any>;
  checkAuthStatus(): void
  getToken(): string;
}
