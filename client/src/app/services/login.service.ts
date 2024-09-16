import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url = 'http://localhost:3002/api/users';
  urlLoginUser = 'http://localhost:3002/api/login-user';
  urlLoginAdmin = 'http://localhost:3002/api/login';

  constructor(private http: HttpClient) {}

  // login user
  loginUser(data: any) {
    return this.http.post(this.urlLoginUser, data);
  }

  // login admin
  loginAdmin(data: any): Observable<any> {
    return this.http.post(this.urlLoginAdmin, data);
  }

  isTokenExpired(token: string): any {
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    return Date.now() > expirationDate;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('_id');
  }
}
