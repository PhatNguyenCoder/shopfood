import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../entities/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.scss',
})
export class ProductdetailComponent implements OnInit {
  product: IProduct | null = null;
  quantity: number = 1; // default quantity

  constructor(
    private route: ActivatedRoute,
    private _product: ProductService,
    private _cart: CartService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.fetchProductById(productId);
      }
    });
  }

  fetchProductById(id: string) {
    this._product.getProductById(id).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  validateQuantity() {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  submitOrder(productId: string, quantity: number) {
    // Kiểm tra nếu product không rỗng
    if (this.product !== null) {
      const userEmail = localStorage.getItem('userEmail');
      const id_user = localStorage.getItem('_id');

      // Kiểm tra nếu không có user email hoặc id_user là null
      if (!userEmail || !id_user) {
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
      }

      // Lấy giỏ hàng của người dùng
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
          const money = this.quantity * this.product!.price; // Đảm bảo this.product đã tồn tại
          const orderData = {
            productName: this.product!.productName,
            image: this.product!.image,
            price: this.product!.price,
            quantity: this.quantity,
            money,
            id_user,
            id_product: this.product!._id,
          };
          this._cart.postCart(orderData).subscribe({
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
        }
      });
    }
  }
}
