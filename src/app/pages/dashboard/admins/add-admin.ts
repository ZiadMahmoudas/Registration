import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersServices } from '../../../core/services/dashboard/AllusersInfo/UsersServices';
import { TokenServices } from '../../../core/services/browser/TokenServices';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-admin',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.scss'
})
export class AddAdmin {
  constructor(private FB:FormBuilder,private dashboardService:UsersServices,private tostar:ToastrService){
     this.AddStaff= this.FB.group({
  username: [''],
  passwordHash: [''],
  email: [''],
     })
  }
onSubmit() {
  if (this.AddStaff.valid) {
    const data = this.AddStaff.value;
this.dashboardService.AddStaff(data).subscribe({
  next: (res) => {
    this.tostar.success("Staff Member is Added");
  },
  error: (err) => {
    console.error('Error:', err);

   if (err.error && typeof err.error === 'object') {
      console.error('Server error:', err.error);
    } else {
      console.error('Unexpected error:', err.message || err);
    }
  }
});

  }
}
AddStaff!:FormGroup

}
