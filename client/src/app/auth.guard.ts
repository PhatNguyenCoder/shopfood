import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(): boolean | Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token && !this.loginService.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
