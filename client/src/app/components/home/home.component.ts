import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../entities/product';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: IProduct[] = [];
  hotProduct: IProduct[] = [];
  cartForm!: FormGroup;

  constructor(
    private _product: ProductService,
    private _router: Router,
    private _cart: CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchHotProduct();
    this.setForm();
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

  fetchHotProduct() {
    this._product.getHotProduct().subscribe(
      (data) => {
        this.hotProduct = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setForm() {
    this.cartForm = new FormGroup({
      _id: new FormControl(''),
      productName: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(''),
      quantity: new FormControl(1),
    });
  }

  submit(
    productId: string,
    productName: string,
    image: string,
    price: number,
    quantity: number
  ) {
    const userEmail = localStorage.getItem('userEmail');
    let id_user = localStorage.getItem('_id');
    if (!userEmail) {
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
      this._cart.getCartByUser(id_user).subscribe((cart) => {
        const checkCart = cart.find((item) => item.id_product === productId);
        if (checkCart) {
          const newQuantity = checkCart.quantity + quantity;
          this._cart.updateCartQuantity(checkCart._id, newQuantity).subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Đã đặt món',
                text: 'Thanh toán ngay',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/cart']);
                }
              });
            },
            error: (err) => {
              console.log(err);
            },
          });
        } else {
          const money = quantity * price;

          const data = {
            productName,
            image,
            price,
            quantity,
            money,
            id_user,
            id_product: productId,
          };

          console.log(data);

          this._cart.postCart(data).subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Đã đặt món',
                text: 'Thanh toán ngay',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/cart']);
                }
              });
              return;
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      });
    }
  }
}
