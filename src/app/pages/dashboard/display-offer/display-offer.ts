import { ActivatedRoute, Router } from '@angular/router';
import { UsersServices } from '../../../core/services/dashboard/AllusersInfo/UsersServices';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-offer',
  imports: [],
  templateUrl: './display-offer.html',
  styleUrl: './display-offer.scss'
})
export class DisplayOffer {
  constructor(
    private dashboardService:UsersServices,
    private router:Router,
    private tostar:ToastrService
  ){}
  offers:any = [];
  isEdit:boolean = false;
  editProductId:number = 0;
  ngOnInit(){
    this.GetAllOffers();
 
  }
  GetAllOffers(){
    this.dashboardService.getAllOffers().subscribe({
      next:(res)=>{
        this.offers = res;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  
Edit(id:number){
 this.router.navigate(['/Dashboard/Offer',id])
}
Delete(id:number){
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
      this.dashboardService.DeleteOffer(id).subscribe({
        next: (res:any) => {
          console.log(res);
          this.tostar.success("Removed SuccessFully");
          this.GetAllOffers();
          
        },
        error: (err) => {
          console.log(err);
          this.tostar.error("Please Don't Deleted That because attached for product");
        }
      });
    }
  });
}

}
