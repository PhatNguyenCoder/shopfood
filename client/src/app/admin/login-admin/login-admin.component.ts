import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss',
})
export class LoginAdminComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private _loginAdmin: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      this._loginAdmin.loginAdmin(this.loginForm.value).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);

          let timerInterval: any;
          Swal.fire({
            title: 'Auto close alert!',
            html: 'I will close in <b></b> milliseconds.',
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup()?.querySelector('b');
              if (timer) {
                // Check if timer element exists
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              }
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer');
              this.router.navigate(['admin/dashboard-admin']);
            }
          });
        },
        (error) => {
          alert(error.error.message || 'Không có quyền truy cập');
          // this.loginForm.reset();
        }
      );
    } else {
      alert('Đăng nhập thất bại');
      this.loginForm.markAllAsTouched();
    }
  }
}
