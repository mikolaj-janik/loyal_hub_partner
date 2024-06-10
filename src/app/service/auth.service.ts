import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';
  private hasErrors = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.isAuthenticatedSubject.asObservable();
  private routerService = inject(Router);
  

  private http = inject(HttpClient);

  constructor() { }

  login(user: { email: string, password: string }): Observable<any>{
    return this.http
    .post('http://localhost:8080/api/login_check', user)
    .pipe(
      tap((tokens: any)=>this.doLoginUser(user.email, tokens.token)),
      catchError((error) => {
        if (error.status === 401) {
          this.hasErrors = true;
          return    throwError('Invalid email or password');
        } else {
          
          return throwError('An error occurred during login');
        }
      })
      
    );
  }

  register(user: { email: string, password: string, repeatedPassword: string}): Observable<any>{

    return this.http
    .post(`http://localhost:8080/api/register`, user)
    .pipe(
      tap((tokens: any) => {
        this.doLoginUser(user.email, tokens.token)}),
      catchError((error) => {
        if (error.status === 401) {
          this.hasErrors = true;
          return throwError('Invalid email or password');
        } else {
          
          return throwError('An error occurred during login');
        }
      })
    )
  }

  getLoyaltyPrograms(): Observable<LoyaltyProgram[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ loyaltyPrograms: LoyaltyProgram[] }>('http://localhost:8080/api/loyalty_programs', { headers })
      .pipe(
        map(response => response.loyaltyPrograms), 
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.hasErrors = true;
            return throwError('Unauthorized access');
          } else {
            return throwError('An error occurred while fetching loyalty programs');
          }
        })
      );
  }

  addLoyaltyProgram(program: {loyaltyProgramName: string}): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getJwtToken()}`
    });
    return this.http.post<any>('http://localhost:8080/api/loyalty_programs', program, { headers })
  }
  
  sendInvitation(loyaltyProgramUuid: string, clientEmail: string): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/invitations`;
    const body = { clientEmail };
    const headers = this.getAuthHeaders();
    return this.http.post<any>(url, body, { headers }).pipe(
      
    );
  }

  private doLoginUser(email: string, token: string) {
    this.isAuthenticatedSubject.next(true);
    this.hasErrors = false;
    this.storeJwtToken(token);
    this.storeUserEmail(email);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeUserEmail(email: string) {
    localStorage.setItem(this.USER_EMAIL, email);
  }

  private getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  private getAuthHeaders(): HttpHeaders {
    const token = this.getJwtToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  authenticateByToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
    this.isAuthenticatedSubject.next(true);
    this.hasErrors = false;
  }

  isError() : boolean {
    return this.hasErrors;
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.routerService.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL);
  }

}


export interface LoyaltyProgram {
  id: string;
  name: string;
  loyalty_levels: LoyaltyLevel[];
}

export interface LoyaltyLevel {
  id: string;
  name: string;
  valueFactor: ValueFactor;
  loyaltyProgram: string;
}

export interface ValueFactor {
  valueFactor: number;
}