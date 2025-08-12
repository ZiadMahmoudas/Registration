import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersServices } from '../../../../core/services/dashboard/AllusersInfo/UsersServices';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offer',
  imports: [ReactiveFormsModule],
  templateUrl: './offer.html',
  styleUrl: './offer.scss'
})
export class Offer {
  constructor(
    private FB:FormBuilder,
    private tostar :ToastrService,
    private dashboardboard:UsersServices,
    private route:ActivatedRoute
  )
  {
this.offer = this.FB.group({
    title:['',Validators.required],
    discount:['',Validators.required],
    endDate:['',Validators.required],
})
  }
  isEdit:boolean = false;
  editProductId:number = 0;
  ngOnInit(){
          const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.editProductId = +id;
      this.loadOffer(this.editProductId);
    }
  }
  offer!:FormGroup
submit() {
  if (this.offer.invalid) {
    this.tostar.warning("Please enter all fields");
    return;
  }

  if (this.isEdit) {
    this.dashboardboard.UpdateOffer(this.editProductId,this.offer.value).subscribe({
      next: () => {
        this.tostar.success("Offer updated successfully");
      
      },
      error: () => {
        this.tostar.error("Failed to update offer");
      }
    });
  } else {
    this.dashboardboard.CreateOffers(this.offer.value).subscribe({
      next: () => {
        this.tostar.success("Offer created successfully");
        this.offer.reset();
      },
      error: () => {
        this.tostar.error("Failed to create offer");
      }
    });
  }
}

  loadOffer(id: number) {
    this.dashboardboard.getOneOffer(id).subscribe((offer: any) => {
      if (offer) { 
        this.offer.patchValue({
          title:offer.title,
          discount:offer.discount,
          endDate:offer.endDate
        });
      }
    });
  }

}
