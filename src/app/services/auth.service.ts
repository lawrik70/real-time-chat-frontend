import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.currentUser.pipe(map(user => !!user));
  }

  register(username: string, password: string): Promise<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password })
      .toPromise()
      .then(() => {
        this.login(username, password);
      });
  }

  login(username: string, password: string): void {
    // In a real app, verify credentials with backend
    localStorage.setItem('currentUser', username);
    this.currentUserSubject.next(username);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}