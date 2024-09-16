import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IProduct } from '../../entities/product';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../entities/category';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
})
export class ManageProductComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  isForm: boolean = false;
  isFormUpdate: boolean = false;
  productForm!: FormGroup;
  productFormUpdate!: FormGroup;
  imageFileName: string = '';
  selectedImage: File | null = null;

  constructor(
    private _product: ProductService,
    private _category: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategory();
    this.setForm();
    this.setFormUpdate();
  }

  // load sản phẩm
  fetchProducts() {
    this._product.getProduct().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // xoá sản phẩm
  deleteProduct(id: string) {
    this._product.deleteProduct(id).subscribe(
      () => {
        // this.fetchProducts();
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

  showForm() {
    this.isForm = true;
  }

  hideForm() {
    this.isForm = false;
  }

  // lấy list category
  fetchCategory() {
    this._category.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // thêm sản phẩm
  setForm() {
    this.productForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      id_category: new FormControl('', [Validators.required]),
      hot: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      ingredient: new FormControl('', [Validators.required]),
      energy: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);

      this.imageFileName = file.name;
      this.productForm.patchValue({
        image: file,
      });
      this.productFormUpdate.patchValue({
        image: file,
      });
    }
  }

  submit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      const formValue = this.productForm.value;

      formData.append('productName', formValue.productName);
      formData.append('price', formValue.price);
      formData.append('id_category', formValue.id_category);
      formData.append('hot', formValue.hot);
      formData.append('description', formValue.description);
      formData.append('ingredient', formValue.ingredient);
      formData.append('energy', formValue.energy);
      formData.append('active', formValue.active);

      if (this.imageFileName) {
        formData.append('image', formValue.image, this.imageFileName);
      }

      this._product.postProduct(formData).subscribe({
        next: (res: any) => {
          // location.reload();
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
      this.productForm.markAllAsTouched();
    }
  }

  // Update
  submitUpdate(id: string) {
    this.showFormUpdate(id);
  }

  submitFormUpdate() {
    if (this.productFormUpdate.valid) {
      const formData = new FormData();
      const formValue = this.productFormUpdate.value;

      const productId = formValue._id;
      console.log(productId);

      formData.append('_id', formValue._id);
      formData.append('productName', formValue.productName);
      formData.append('price', formValue.price);
      formData.append('id_category', formValue.id_category);
      formData.append('hot', formValue.hot);
      formData.append('description', formValue.description);
      formData.append('ingredient', formValue.ingredient);
      formData.append('energy', formValue.energy);
      formData.append('active', formValue.active);

      if (this.imageFileName) {
        formData.append('image', formValue.image, this.imageFileName);
      }

      this._product.updateProduct(productId, formData).subscribe({
        next: (res: any) => {
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  setFormUpdate() {
    this.productFormUpdate = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      id_category: new FormControl('', [Validators.required]),
      hot: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      ingredient: new FormControl('', [Validators.required]),
      energy: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
    });
  }

  getProductById(id: string) {
    this._product.getProductById(id).subscribe(
      (data) => {
        this.productFormUpdate.patchValue({
          _id: data._id,
          productName: data.productName,
          price: data.price,
          image: data.image,
          id_category: data.id_category,
          hot: data.hot,
          description: data.description,
          ingredient: data.ingredient,
          energy: data.energy,
          active: data.active,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showFormUpdate(id: string) {
    this.isFormUpdate = true;
    this.getProductById(id);
  }

  hideFormUpdate() {
    this.isFormUpdate = false;
  }
}
