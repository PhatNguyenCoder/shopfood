import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../entities/category';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss',
})
export class ManageCategoryComponent implements OnInit {
  cateForm!: FormGroup;
  categories: ICategory[] = [];

  constructor(private _category: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.setForm();
  }

  setForm() {
    this.cateForm = new FormGroup({
      _id: new FormControl(''),
      categoryId: new FormControl('', [Validators.required]),
      categoryName: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    if (this.cateForm.valid) {
      console.log(this.cateForm.value);
      this._category.postCategories(this.cateForm.value).subscribe({
        next: (res: any) => {
          // save email localStorage
          localStorage.setItem('userEmail', this.cateForm.value.email);

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
              location.reload();
            }
          });
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
      alert('Lỗi');
      this.cateForm.markAllAsTouched();
    }
  }

  fetchCategories() {
    this._category.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCategory(id: string) {
    this._category.deleteCategory(id).subscribe(
      () => {
        // this.fetchCategories();
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, log me out!',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
            Swal.fire({
              title: 'Logged Out!',
              text: 'You have been logged out.',
              icon: 'success',
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: 'Cancelled',
              text: 'You are still logged in!',
              icon: 'info',
            });
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // lấy cate dữ liệu cũ theo id để update
  getCateById(id: string) {
    this._category.getCateById(id).subscribe(
      (data: any) => {
        this.cateForm.patchValue({
          _id: data._id,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          active: data.active,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  OnUpdateCategory(id: string) {
    this.getCateById(id);
  }

  // thực hiện update
  updateCategory(id: string) {
    const postData: ICategory = this.cateForm.value;
    this._category.updateCategory(id, postData).subscribe(
      (data: any) => {
        this.cateForm.reset();
        this.fetchCategories();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addOrUpdateCate() {
    if (this.cateForm.valid) {
      if (!this.cateForm.get('_id')?.value) {
        this.cateForm.get('_id')?.setValue(null);
      }
      if (this.cateForm.get('_id')?.value) {
        this.updateCategory(this.cateForm.get('_id')?.value);
      } else {
        this.submit();
      }
    } else {
      this.cateForm.markAllAsTouched();
    }
  }
}
