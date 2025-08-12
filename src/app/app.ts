import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./main-layout/footer/footer";
import { Navbar } from "./main-layout/navbar/navbar";
import { AuthService } from './core/services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Registration';

  constructor(private authService:AuthService){}
ngOnInit(): void {
  this.scheduleTokenRefresh();

}

scheduleTokenRefresh(): void {
  setInterval(() => {
    const token = this.authService.getAccessToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = expiry - now;

      if (secondsLeft <= 60) {
        this.authService.refreshToken().subscribe({
          next: () => console.log("Token refreshed"),
          error: () => console.log("Failed to refresh token"),
        });
      }
    }
  }, 5000);
}


}
