import { Component, TrackByFunction } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersServices } from '../../../core/services/dashboard/AllusersInfo/UsersServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
 users: any = [];
  previousUserCount = 0;
  audio = new Audio();
  pollingSubscription: Subscription | undefined;
trackByUserId: TrackByFunction<any>;

  constructor(
    private UsersServices: UsersServices,
    private toastr: ToastrService
  ) {
    this.audio.src = 'audio/rang.mp3';
    this.audio.load();
  }
deleteUser(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "لن تتمكن من التراجع عن هذا!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء',
  }).then((result) => {
    if (result.isConfirmed) {
      this.UsersServices.deleteUser(id).subscribe({
        next: (res) => {
          console.log('Res:', res);
          this.users = this.users.filter((user: any) => user.id !== id);
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
    this.pollingSubscription = interval(1_900_00).subscribe(() => {
      this.checkForNewUsers();
    });
 this.checkForNewUsers();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

checkForNewUsers() {
  this.UsersServices.getAllUsers().subscribe({
    next: (res: any) => {
      const newUsers = res ?? [];

      const oldUserIds = this.users.map((u: any) => u.id);
      const newUserIds = newUsers.map((u: any) => u.id);

      const hasNewUser = newUserIds.some(id => !oldUserIds.includes(id));

      if (hasNewUser) {
        this.playNotificationSound();
      }

      this.users = newUsers;
    },
    error: (err) => {
      if (err.status === 403) {
        this.toastr.error("Don't Play Here Again 😈");
      }
    }
  });
}


  playNotificationSound() {
    this.audio.play().catch(() => {
    });
  }
}
