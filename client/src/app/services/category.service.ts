import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../entities/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url = 'http://localhost:3002/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.url);
  }

  postCategories(data: any): Observable<ICategory[]> {
    return this.http.post<ICategory[]>(this.url, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(this.url + `/${id}`);
  }

  getCateById(id: string): Observable<any> {
    return this.http.get(this.url + `/${id}`);
  }

  updateCategory(id: string, postDataU: ICategory): Observable<any> {
    return this.http.put(this.url + `/${id}`, postDataU);
  }
}
