import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../entities/category';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-productcate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productcate.component.html',
  styleUrl: './productcate.component.scss',
})
export class ProductcateComponent implements OnInit {
  productCate: any;
  empty: boolean = false;
  categoryName: string = '';

  constructor(
    private _productCate: ProductService,
    private _cateName: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchProductByCategory(id);
        this.setCategoryName(id);
      }
    });
  }

  fetchProductByCategory(id: string): void {
    this._productCate.getProductByCategory(id).subscribe((data) => {
      this.productCate = data;
      this.empty = data.length === 0;
    });
  }

  setCategoryName(id: string): void {
    this._cateName.getCategories().subscribe((data: ICategory[]) => {
      const categoryId = Number(id);
      const category = data.find(
        (cat: ICategory) => cat.categoryId === categoryId
      );
      this.categoryName = category ? category.categoryName : 'Danh mục';
    });
  }
}
