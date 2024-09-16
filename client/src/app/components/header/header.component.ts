import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userEmail: string | null = '';

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
  }

  constructor(private _router: Router) {}

  logout() {
    localStorage.removeItem('userEmail');
    this.userEmail = null;
    this._router.navigate(['login']);
  }

  cart() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.log('đăng nhập');
      Swal.fire({
        title: 'Bạn chưa đăng nhập!',
        text: 'Vui lòng đăng nhập để đặt món.',
        icon: 'warning',
        confirmButtonText: 'Đăng nhập',
      }).then((result) => {
        if (result.isConfirmed) {
          this._router.navigate(['/login']);
        }
      });
      return;
    } else {
      this._router.navigate(['/cart']);
    }
  }
}
