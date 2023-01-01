import { AuthState, IAuthService } from "./IAuthService";
import { Observable, Subject } from "rxjs";
import { Toast } from "../ToastNotificationService/Toast";
import { URLService } from "../URLService/URLService";
import { NetworkCallService } from "../NetworkCallService/NetworkCallService";

interface StoredUser {
  username: string;
  name: string;
  token: string;
}

export class AuthServiceProvider implements IAuthService {
  private authStateSubject = new Subject<AuthState>();

  constructor() {
    this.checkAuthStatus();
  }

  getToken(): string {
    if (this.isLoggedIn()) {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}") as StoredUser;
      return user.token;
    }
    return "";
  }

  getLoggedInStateObserver(): Observable<AuthState> {
    return this.authStateSubject;
  }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem("user")) {
      return true;
    }
    return false;
  }

  checkAuthStatus() {
    if (this.isLoggedIn()) {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      this.authStateSubject.next({
        isLoggedIn: true,
        user: { username: user.username, name: user.name, token: user.token },
      });
    } else {
      this.authStateSubject.next({ isLoggedIn: false, user: {} });
    }
  }

  async login(userName: string, password: string): Promise<any> {
    try {
      const url = URLService.getInstance().generateURL('/auth/login');
      const response = await NetworkCallService.getInstance().post(url, {username: userName,password: password});
      if (response.status !== 200) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const { user, token} = await response.json();
      
      window.sessionStorage.setItem(
        "user",
        JSON.stringify({ username:user.username, name:user.name, token })
      );
      this.authStateSubject.next({
        isLoggedIn: true,
        user: { username:user.username, name:user.name, token },
      });
      Toast.success("Login Success");
      return user;
    } catch (error: any) {
      Toast.error("Login error", error.message);
      return { error };
    }
  }

  async register(
    userName: string,
    password: string,
    name: string,
    email: string
  ): Promise<any> {
    try {
      const url = URLService.getInstance().generateURL('/auth/register');
      const response = await NetworkCallService.getInstance().post(url, {username: userName,password: password, name: name, email: email});
      if (response.status !== 200) {
        const data = await response.json();
        throw new Error(data.error);
      }    
      Toast.success("Signup Success", "Please confrim your account to proceed.")
    } catch (error: any) {
      console.log("error signing up:", error);
      Toast.error("Signup error", error.message);
      return { error };
    }
  }

  async logout(): Promise<any> {
    if (!this.isLoggedIn()) {
      return { error: "No user logged in" };
    }
    try {
      window.sessionStorage.removeItem("user");
      this.authStateSubject.next({ isLoggedIn: false, user: {} });
      Toast.info("Logged out!");
      return { success: true };
    } catch (error: any) {
      console.log("error signing out: ", error);
      Toast.error("Signout error", error.message);
      return { error };
    }
  }

  refreshToken(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
