import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersServices } from '../../core/services/dashboard/AllusersInfo/UsersServices'; // الخدمة التي تحمل المنتجات
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth/auth-service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  imports:[CommonModule]
})
export class View implements OnInit {
  product: any = null;
  added:any = true;
  allProducts: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private auth:AuthService,
    private dashboardService: UsersServices,
    private router: Router,
    private toastr:ToastrService
  ) {}
  addToCart(){
   this.added = false;
  }
RemoveFromcart(){
  this.added = true;
}
cachedProducts: any[] = []
ngOnInit(): void {
  const id = +this.route.snapshot.params['id'];
  if (this.cachedProducts && this.cachedProducts.length > 0) {
    this.product = this.cachedProducts.find(p => +p.productId === id);
    if (!this.product) this.router.navigate(['/not-found']);
  } else {
    this.dashboardService.GetAllProduct().subscribe({
      next: (res: any) => {
        this.cachedProducts = Array.isArray(res) ? res : (res.data || []);
        this.product = this.cachedProducts.find(p => p.id === id);
        if (!this.product) this.router.navigate(['/not-found']);
      },
      error: () => {
        this.router.navigate(['/error']);
      }
    });
  }
}
  edit(id: number) {
    this.router.navigate(['/Dashboard/product', id]);
  }
RemoveItem(id: any) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "هل تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء'
  }).then((result) => {
    if (result.isConfirmed) {
      this.dashboardService.DeleteProduct(id).subscribe({
        next: (res) => {
          this.toastr.success("Removed SuccessFully");
          this.router.navigateByUrl("/Home")
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("err");
        }
      });
    }
  });
}
tag:any
  roles(){
const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const accessToken: any = this.auth.getAccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  const role = decoded[roleClaim];
  const isAdmin = true; 
   if (role === 'Admin' || role === "Staff") {
    return isAdmin;
  }
return !isAdmin;
}
}
