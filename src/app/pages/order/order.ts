import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order {
  constructor(private router:Router){}
  buy(){
   this.router.navigateByUrl("checkout")
}
}
