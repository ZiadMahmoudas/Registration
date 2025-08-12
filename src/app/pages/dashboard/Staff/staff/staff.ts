import { Component, TrackByFunction } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { UsersServices } from '../../../../core/services/dashboard/AllusersInfo/UsersServices';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff',
  imports: [CommonModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss'
})
export class Staff {
 staffs: any = [];
  previousUserCount = 0;
  audio = new Audio();
  pollingSubscription: Subscription | undefined;
trackByUserId: TrackByFunction<any>;

  constructor(
    private UsersServices: UsersServices,
    private toastr: ToastrService
  ) {}
deletestaff(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "لن تتمكن من التراجع عن هذا!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء',
  }).then((result) => {
    if (result.isConfirmed) {
      this.UsersServices.deleteStaff(id).subscribe({
        next: (res) => {
          console.log('Res:', res);
          this.staffs = this.staffs.filter((staff: any) => staff.id !== id);
          this.toastr.success("Delete Successfully");
        },
        error: (err) => {
          console.log(err.status);
          this.toastr.error("Error something Wrong");
        }
      });
    }
  });
}
  ngOnInit(): void {
 this.checkForNewUsers();
  }
  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }
checkForNewUsers() {
  this.UsersServices.getAllStaff().subscribe({
    next: (res: any) => {
      const newUsers = res ?? [];
      console.log(res);

      this.staffs = newUsers;
    },
    error: (err) => {
      if (err.status === 403) {
        this.toastr.error("Don't Play Here Again 😈");
      }
    }
  });
}
}
