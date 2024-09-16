import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICart } from '../entities/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  url = 'http://localhost:3002/api/cart';

  // url1 = 'http://localhost:3002/api/cart/';

  constructor(private http: HttpClient) {}

  postCart(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  getCartByUser(id_user: any): Observable<ICart[]> {
    return this.http.get<ICart[]>(`${this.url}/${id_user}`);
  }

  // xoá sản phẩm giỏ hàng
  deleteCart(id: string): Observable<any> {
    return this.http.delete(this.url + `/${id}`);
  }

  // update quantity cart
  updateCartQuantity(cartId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.url}/${cartId}`, { quantity });
  }
}
