import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../entities/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  url = 'http://localhost:3002/api/order';
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  postOrder(data: Order): Observable<Order[]> {
    return this.http.post<Order[]>(this.url, data);
  }

  updateStatus(orderId: string, active: number): Observable<any> {
    return this.http.put(`${this.url}/${orderId}`, { active });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${orderId}`);
  }
}
