import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  ApiMessage,
  AuthSession,
  AuthUser,
  BackendAuthResponse,
  LoginRequest,
  SignupRequest
} from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly apiBaseUrl = 'http://localhost:8080/api/auth';
  readonly oauthBaseUrl = 'http://localhost:8080/oauth2/authorization';

  private readonly tokenKey = 'shopzy_jwt';
  private readonly userKey = 'shopzy_user';
  private readonly buyNowProductKey = 'shopzy_buy_now_product';

  private readonly currentUserSubject =
    new BehaviorSubject<AuthUser | null>(
      this.readStoredUser()
    );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken() && !this.currentUserSubject.value) {
      this.refreshCurrentUser().subscribe({
        error: () => this.logout()
      });
    }
  }

  // ---------------- LOGIN ----------------

  login(payload: LoginRequest): Observable<AuthSession> {

    return this.http.post(
      `${this.apiBaseUrl}/login`,
      {
        username: payload.usernameOrEmail,
        password: payload.password
      },
      {
        responseType: 'text'
      }
    
    ).pipe(
      map(response => {
        const parsed = this.parseBackendResponse(response);
        const token = this.extractToken(parsed);

        if (!token) {
          throw new Error('Login response did not include a JWT.');
        }

        this.saveToken(token);
        return { parsed, token };
      }),
      switchMap(({ parsed, token }) =>
        this.getLoggedInUser().pipe(
          map(user => this.buildSession(parsed, token, user)),
          catchError(() => of(this.buildSession(
            parsed,
            token,
            this.buildFallbackUser(parsed, payload.usernameOrEmail)
          )))
        )
      ),
      tap(session => this.saveUser(session.user))
    );

  }

  // ---------------- REGISTER ----------------

  signup(payload: SignupRequest): Observable<ApiMessage> {
    alert("payload: " + JSON.stringify(payload));

    return this.http.post(
      `${this.apiBaseUrl}/register`,
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.email,
        password: payload.password
      },
      {
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = this.parseBackendResponse(response);
        if (typeof parsed === 'string') {
          return { message: parsed };
        }

        return { message: parsed.message || 'Account created successfully.' };
      })
    );

  }

  // ---------------- OAUTH ----------------

  loginWithOAuth(provider: 'google' | 'github' = 'google'): void {

    window.location.href =
      `${this.oauthBaseUrl}/${provider}`;

  }

  completeOAuthLogin(token: string): Observable<AuthUser> {
 console.log('Completing OAuth login with token:', token);
    this.saveToken(token);

    return this.getLoggedInUser().pipe(
      catchError(() => of(this.buildFallbackUserFromToken(token))),
      tap(user => this.saveUser(user))

    );

  }

  // ---------------- USER ----------------

  getLoggedInUser(): Observable<AuthUser> {

    return this.http.get<AuthUser>(
      `${this.apiBaseUrl}/me`
    ).pipe(
      map(user => this.normalizeUser(user))
    );

  }

  refreshCurrentUser(): Observable<AuthUser> {

    return this.getLoggedInUser().pipe(
      tap(user => this.saveUser(user))
    );

  }

  saveUser(user: AuthUser): void {
    localStorage.setItem(
      this.userKey,
      JSON.stringify(user)
    );
console.log('Saving user to localStorage:', JSON.stringify(user));

    this.currentUserSubject.next(user);

  }

  getCurrentUser(): AuthUser | null {

    return this.currentUserSubject.value;

  }

  // ---------------- TOKEN ----------------

  saveToken(token: string): void {

    localStorage.setItem(
      this.tokenKey,
      token.replace(/^Bearer\s+/i, '').trim()
    );

  }

  getToken(): string | null {

    return localStorage.getItem(this.tokenKey);

  }

  // ---------------- LOGOUT ----------------

  logout(): void {

    localStorage.removeItem(this.tokenKey);

    localStorage.removeItem(this.userKey);

    sessionStorage.removeItem(this.buyNowProductKey);

    this.currentUserSubject.next(null);

  }

  logoutAndGoHome(): void {

    this.logout();

    window.location.href = '/home';

  }

  // ---------------- HELPERS ----------------

  private extractToken(response: BackendAuthResponse): string {

    if (typeof response === 'string') {

      return response.replace(/^Bearer\s+/i, '').trim();

    }

    return response.token ||
           response.jwt ||
           response.accessToken ||
           '';

  }

  private parseBackendResponse(response: string): BackendAuthResponse {

    try {

      return JSON.parse(response);

    } catch {

      return response;

    }

  }

  private buildSession(
    response: BackendAuthResponse,
    token: string,
    user: AuthUser
  ): AuthSession {
    if (typeof response === 'string') {
      return { token, user };
    }

    return {
      token,
      message: response.message,
      user: this.normalizeUser({
        ...user,
        ...response.user,
        username: response.user?.username || response.username || user.username,
        email: response.user?.email || response.email || user.email,
        role: response.user?.role || response.role || user.role
      })
    };
  }

  getDisplayName(user: AuthUser | null): string {
    console.log("user1: " + JSON.stringify(user));

    if (!user) {

      return '';

    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    console.log("fullName2: " + fullName);
    console.log("displayName3: " + (user.displayName || user.name || fullName || this.getKnownDisplayName(user.username) || user.username || user.email || ''));

    return user.displayName ||
           user.name ||
           fullName ||
           this.getKnownDisplayName(user.username) ||
           user.username ||
           user.email ||
           '';

  }

  private normalizeUser(user: AuthUser): AuthUser {

    const displayName =
      user.displayName ||
      user.name ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      this.getKnownDisplayName(user.username);

    return {
      ...user,
      displayName: displayName || user.username || user.email || ''
    };

  }

  private buildFallbackUser(
    response: BackendAuthResponse,
    usernameOrEmail: string
  ): AuthUser {

    if (typeof response !== 'string') {

      const username = response.user?.username ||
                       response.username ||
                       usernameOrEmail;

      return this.normalizeUser({
        ...response.user,
        username,
        email: response.user?.email ||
               response.email ||
               (usernameOrEmail.includes('@') ? usernameOrEmail : undefined),
        role: response.user?.role || response.role
      });

    }

    return this.normalizeUser({
      username: usernameOrEmail,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined
    });

  }

  private buildFallbackUserFromToken(token: string): AuthUser {

    const username = this.extractUsernameFromToken(token) || 'akash';

    return this.normalizeUser({
      username
    });

  }

  private extractUsernameFromToken(token: string): string {

    const parts = token.replace(/^Bearer\s+/i, '').trim().split('.');

    if (parts.length < 2) {

      return '';

    }

    try {

      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      return payload.sub || payload.username || '';

    } catch {

      return '';

    }

  }

  private getKnownDisplayName(username?: string): string {

    if (username?.toLowerCase() === 'akash') {

      return 'Akash Satpute';

    }

    return '';

  }

  private readStoredUser(): AuthUser | null {

    const user = localStorage.getItem(this.userKey);

    if (!user) {

      return null;

    }

    try {

      return JSON.parse(user);

    } catch {

      return null;

    }

  }
}
