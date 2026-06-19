import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'tcp_session_token';

    /**
     * Signal para manejar de manera reactiva el estado de autenticacion
     */
    public isAuthenticated = signal<boolean>(this.checktoken());

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
        tap(response => {
            if (response && response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            this.isAuthenticated.set(true);
            }
        })
        );
    }

    logout():void{
        localStorage.removeItem(this.TOKEN_KEY);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    getToken():string | null{
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private checktoken(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

}
