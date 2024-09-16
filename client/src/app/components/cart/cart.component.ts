import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  carts: ICart[] = [];
  userId: string | null = null;
  totalAmount: number = 0;
  empty: boolean = false;

  constructor(private _cartByUser: CartService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('_id');
    if (this.userId) {
      this.fetchCartByUser(this.userId);
    } else {
      console.error('User ID not found in localStorage');
    }
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
}
