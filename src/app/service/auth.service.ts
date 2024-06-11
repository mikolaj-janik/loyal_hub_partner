import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ValueFactor } from '../entity/value-factor';
import { LoyaltyLevel } from '../entity/loyalty-level';
import { LoyaltyProgram } from '../entity/loyalty-program';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';
  private readonly PROGRAM_ID = 'PROGRAM_ID';
  private readonly LEVEL_ID = 'LEVEL_ID';
  private readonly LEVEL_NAME = 'LEVEL_NAME';
  private readonly LEVEL_VALUE = 'LEVEL_VALUE';
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
        if (error.status === 400 || error.status === 401) {
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
    return this.http.get<{ loyaltyPrograms: any[] }>('http://localhost:8080/api/loyalty_programs', { headers })
      .pipe(
        map(response => response.loyaltyPrograms.map(program => new LoyaltyProgram(
          program.id,
          program.name,
          program.loyaltyLevels ? program.loyaltyLevels.map((level: any) => new LoyaltyLevel(
            level.id,
            level.name,
            new ValueFactor(level.valueFactor.valueFactor),  
            level.loyaltyProgram
          )) : []
        ))),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
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

  addLoyaltyLevel(loyaltyProgramUuid: string, loyaltyLevel: { loyaltyLevelName: string, valueFactor: number }): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/loyalty_program_levels`;
    const headers = this.getAuthHeaders();
    return this.http.post<any>(url, loyaltyLevel, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.hasErrors = true;
            return throwError('Unauthorized access');
          } else {
            return throwError('An error occurred while adding the loyalty level');
          }
        })
      );
  }

  updateLoyaltyLevel(loyaltyProgramUuid: string, loyaltyLevelUuid: string, loyaltyLevel: { loyaltyLevelName: string, valueFactor: number }): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/loyalty_program_levels/${loyaltyLevelUuid}`;
    const headers = this.getAuthHeaders();
    return this.http.put<any>(url, loyaltyLevel, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.hasErrors = true;
            return throwError('Unauthorized access');
          } else {
            return throwError('An error occurred while updating the loyalty level');
          }
        })
      );
  }
  
  deleteLoyaltyLevel(loyaltyProgramUuid: string, loyaltyLevelUuid: string): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/loyalty_program_levels/${loyaltyLevelUuid}`;
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(url, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.hasErrors = true;
            return throwError('Unauthorized access');
          } else {
            return throwError('An error occurred while deleting the loyalty level');
          }
        })
      );
  }

  sendInvitation(loyaltyProgramUuid: string, clientEmail: string): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/invitations`;
    const body = { clientEmail };
    const headers = this.getAuthHeaders();
    return this.http.post<any>(url, body, { headers }).pipe(
      
    );
  }

  addPromoCode(loyaltyProgramUuid: string, loyaltyLevelUuid: string, promoCode: { type: string, valueFactor: number }): Observable<any> {
    const url = `http://localhost:8080/api/loyalty_programs/${loyaltyProgramUuid}/loyalty_levels/${loyaltyLevelUuid}/promocodes`;
    const headers = this.getAuthHeaders();
    return this.http.post<any>(url, promoCode, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.hasErrors = true;
          return throwError('Unauthorized access');
        } else {
          return throwError('An error occurred while adding the promo code');
        }
      })
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

  storeProgramId(programId: string) {
    localStorage.setItem(this.PROGRAM_ID, programId);
  }

  getCurrentProgramId(): string | null {
    return localStorage.getItem(this.PROGRAM_ID);
  }

  storeLevelId(levelId: string) {
    localStorage.setItem(this.LEVEL_ID, levelId);
  }

  getCurrentLevelId(): string | null {
    return localStorage.getItem(this.LEVEL_ID);
  }

  storeLevelName(levelName: string) {
    localStorage.setItem(this.LEVEL_NAME, levelName);
  }

  getCurrentLevelName(): string | null {
    return localStorage.getItem(this.LEVEL_NAME);
  }

  storeLevelValue(levelValue: string) {
    localStorage.setItem(this.LEVEL_VALUE, levelValue);
  }

  getCurrentLevelValue(): string | null {
    return localStorage.getItem(this.LEVEL_VALUE);
  }
}


