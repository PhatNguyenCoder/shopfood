import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../entities/order';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss',
})
export class ManageOrderComponent implements OnInit {
  orders: Order[] = [];
  detailOrder: any | null = null;
  isForm: boolean = false;

  constructor(private _order: OrderService) {}

  ngOnInit(): void {
    this.fetchOrder();
  }

  fetchOrder() {
    this._order.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateOrderStatus(order: any) {
    let newStatus: number;

    if (order.active == 0) {
      newStatus = 1;
    } else if (order.active == 1) {
      newStatus = 2;
    } else {
      newStatus = 0;
    }

    this._order.updateStatus(order._id, newStatus).subscribe(
      (data) => {
        order.active = newStatus;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showDetailOrder(orderId: string) {
    // console.log(orderId);
    this._order.getOrderById(orderId).subscribe(
      (data) => {
        this.detailOrder = data;
        this.isForm = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  hideDetailOrder() {
    this.isForm = false;
    this.detailOrder = null;
  }

  orderStatusColor(status: number) {
    switch (status) {
      case 0:
        return 'red';
      case 1:
        return 'orange';
      case 2:
        return 'green';
      default:
        return 'black';
    }
  }
}
