import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../entities/product';
import { ICategory } from '../entities/category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = 'http://localhost:3002/api/product';
  hotproduct = 'http://localhost:3002/api/product/hot';
  productcate = 'http://localhost:3002/api/product/cate/';
  categoryN = 'http://localhost:3002/api/categories';

  constructor(private http: HttpClient) {}

  // load san pham
  getProduct(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.url);
  }

  getHotProduct(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.hotproduct);
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`);
  }

  getProductByCategory(id: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.productcate}${id}`);
  }

  getNameCate(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.categoryN);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(this.url + `/${id}`);
  }

  postProduct(data: any): Observable<IProduct[]> {
    return this.http.post<IProduct[]>(this.url, data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }
}
