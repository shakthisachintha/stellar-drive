import { AuthState, IAuthService } from "./IAuthService";
import { Auth } from "aws-amplify";
import { Observable, Subject } from "rxjs";
import { AWSconfig } from "../../configs";
import { Toast } from "../ToastNotificationService/Toast";

export class AuthServiceProvider implements IAuthService {
  private authStateSubject = new Subject<AuthState>();

  constructor() {
    Auth.configure(AWSconfig.Auth);
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
        user: { userId: user.userId, name: user.name, token: user.token },
      });
    } else {
      this.authStateSubject.next({ isLoggedIn: false, user: {} });
    }
  }

  async login(userName: string, password: string): Promise<any> {
    try {
      const user = await Auth.signIn(userName, password);
      const userId = user.username;
      const name = user.attributes?.name || userId;
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      window.sessionStorage.setItem(
        "user",
        JSON.stringify({ userId, name, token })
      );
      this.authStateSubject.next({
        isLoggedIn: true,
        user: { userId, name, token },
      });
      Toast.success("Login Success");
      return { userId, name, token };
    } catch (error: any) {
      console.log("error signing in", error);
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
      const user = await Auth.signUp({
        username: userName,
        password,
        attributes: { name, email },
      });
      this.login(userName, password);
      Toast.success("Signup Success", "Please confrim your account to proceed.")
      return { user };
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
      await Auth.signOut();
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
