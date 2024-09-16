import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  ngOnInit(): void {
    this.setForm();
  }

  constructor(private _login: LoginService, private _router: Router) {}

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
      console.log(this.loginForm.value);
      this._login.loginUser(this.loginForm.value).subscribe({
        next: (res: any) => {
          // save email localStorage
          localStorage.setItem('userEmail', this.loginForm.value.email);
          localStorage.setItem('phone', res.phone);
          localStorage.setItem('_id', res._id);

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
              this._router.navigate(['/']).then(() => {
                window.location.reload();
              });
            }
          });
          // this._router.navigate(['']);
        },
        error: (err) => {
          // this.errorMessage = err.error.message || 'Invalid email or password';
          if (err.status == 500) {
            Swal.fire({
              title: 'Login Failed!',
              text: err.error.msg,
              icon: 'error',
            });
          }
        },
      });
    } else {
      alert('Please enter information');
      this.loginForm.markAllAsTouched();
    }
  }
}
