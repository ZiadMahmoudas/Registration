import { Component, signal } from '@angular/core';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
  isLoading = false;
  constructor(private loadingService:LoaderService){}
  ngOnInit():void{
    this.loadingService.loading$.subscribe({
      next:(loadingState:boolean)=>{
        this.isLoading = loadingState;
      }
    })
  }
}
