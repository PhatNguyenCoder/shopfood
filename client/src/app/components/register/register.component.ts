import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  password: boolean = false;

  constructor(private _register: RegisterService, private _router: Router) {}

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.regForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  checkPass() {
    const password = this.regForm.get('password')?.value;
    const confirmPassword = this.regForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  submit() {
    if (!this.checkPass()) {
      this.regForm.setErrors({ password: true });
    } else {
      this.regForm.setErrors(null);
    }
    if (this.regForm.valid && !this.password) {
      console.log(this.regForm.value);
      this._register.registerUser(this.regForm.value).subscribe((data: any) => {
        console.log(data);
        let timerInterval: any;
        Swal.fire({
          title: 'Auto close alert!',
          html: 'I will close in <b></b> milliseconds.',
          timer: 2000,
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
            this._router.navigate(['login']);
          }
        });
        this.regForm.reset();
      });
    } else {
      alert('please enter information');
      this.regForm.markAllAsTouched();
    }
  }
}
