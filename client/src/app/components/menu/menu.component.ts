import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../entities/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  categories: ICategory[] = [];
  productCate: any;

  constructor(
    private _category: CategoryService,
    private _productCate: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this._category.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchProductByCategory(id: string): void {
    this._productCate.getProductByCategory(id).subscribe((data) => {
      this.productCate = data;
    });
  }
}
