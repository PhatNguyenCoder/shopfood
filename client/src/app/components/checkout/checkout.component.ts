import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ICart } from '../../entities/cart';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Order } from '../../entities/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  carts: ICart[] = [];
  userId: string | null = null;
  userEmail: string | null = null;
  phone: string | null = null;
  totalAmount: number = 0;
  empty: boolean = false;
  orderForm!: FormGroup;

  constructor(
    private _cartByUser: CartService,
    private _order: OrderService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('_id');
    this.userEmail = localStorage.getItem('userEmail');
    this.phone = localStorage.getItem('phone');

    if (this.userId) {
      this.fetchCartByUser(this.userId);
    } else {
      console.error('User ID not found in localStorage');
    }
    this.setFormOrder();
  }

  // tất cả sản phẩm theo id user
  fetchCartByUser(userId: string) {
    this._cartByUser.getCartByUser(userId).subscribe(
      (data) => {
        this.carts = data;
        this.calTotalAmount();
        this.empty = data.length === 0;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //xoá sản phẩm
  deleteCart(id: string) {
    this._cartByUser.deleteCart(id).subscribe(
      () => {
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

  calTotalAmount() {
    this.totalAmount = this.carts.reduce((total, cart) => {
      return total + cart.price * cart.quantity;
    }, 0);
  }

  // update quantity cart
  updateQuantity(cartId: string, quantity: number) {
    if (quantity < 1) {
      Swal.fire({
        title: 'Invalid quantity',
        text: 'Quantity cannot be less than 1',
        icon: 'error',
      });
      return;
    }

    this._cartByUser.updateCartQuantity(cartId, quantity).subscribe(
      (updateCart) => {
        const i = this.carts.findIndex((cart) => cart._id == cartId);
        if (i !== -1) {
          this.carts[i].quantity = updateCart.quantity;
          this.calTotalAmount();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // order
  setFormOrder() {
    this.orderForm = new FormGroup({
      email: new FormControl(this.userEmail || ''),
      phone: new FormControl(this.phone || ''),
      address: new FormControl(''),
    });
  }

  submitOrder() {
    const order: Order = {
      items: this.carts.map((cart) => ({
        productId: cart._id,
        image: cart.image,
        productName: cart.productName,
        price: cart.price,
        quantity: cart.quantity,
      })),
      userId: this.userId!,
      email: this.orderForm.get('email')!.value,
      phone: this.orderForm.get('phone')!.value,
      address: this.orderForm.get('address')!.value,
      totalAmount: this.totalAmount,
      active: 0,
      code: '0',
      _id: '',
    };
    console.log(order);
    this._order.postOrder(order).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Đã thanh toán',
          text: 'Cảm ơn bạn đã mua hàng',
          icon: 'success',
        }).then(() => {
          this._router.navigate(['/cart']);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
