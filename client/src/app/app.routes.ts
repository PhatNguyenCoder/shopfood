import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductdetailComponent } from './components/productdetail/productdetail.component';
import { ProductcateComponent } from './components/productcate/productcate.component';
import { CartComponent } from './components/cart/cart.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { ManageCategoryComponent } from './admin/manage-category/manage-category.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { AuthGuard } from './auth.guard';
import { MainAdminComponent } from './admin/main-admin/main-admin.component';
import { ManageProductComponent } from './admin/manage-product/manage-product.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ManageOrderComponent } from './admin/manage-order/manage-order.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'product/:id', component: ProductdetailComponent },
      { path: 'productcate/:id', component: ProductcateComponent },
      { path: 'cart', component: CartComponent },
      { path: 'check-out', component: CheckoutComponent },
    ],
  },
  {
    path: 'admin',
    component: HomeAdminComponent,
    children: [
      { path: '', component: LoginAdminComponent },
      {
        path: 'dashboard-admin',
        component: DashboardAdminComponent,
        children: [
          {
            path: '',
            component: MainAdminComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'manage-product',
            component: ManageProductComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'manage-category',
            component: ManageCategoryComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'manage-order',
            component: ManageOrderComponent,
            canActivate: [AuthGuard],
          },
        ],
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
