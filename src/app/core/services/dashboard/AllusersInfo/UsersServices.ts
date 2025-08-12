import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../token/token';
import { Idashboard } from '../../../model/Idashboard';
import { Observable } from 'rxjs';
import { IStaff } from '../../../model/IStaff';
import { IProduct } from '../../../model/Iproduct';

@Injectable({
  providedIn: 'root',
})
export class UsersServices {
  constructor(private http: HttpClient) {}
  private readonly baseURL: string = inject(API_URL);
  getAllUsers() {
    return this.http.get<Idashboard[]>(`${this.baseURL}GetUsers/users`);
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}GetUsers/${id}`);
  }
  AddStaff(data:IStaff){
    return this.http.post(`${this.baseURL}Staff/add`,data,{withCredentials:true,responseType:'text' });
  }
  getAllStaff(){
    return this.http.get(`${this.baseURL}Staff/Get`,{withCredentials:true });
  }
  deleteStaff(id:number){
        return this.http.delete(`${this.baseURL}Staff/${id}`,{withCredentials:true,responseType:'text' });
  }
  GetAllProduct(){
        return this.http.get<any[]>(`${this.baseURL}Product`,{withCredentials:true})
  }
  updateProduct(id:number,data:any){
    return this.http.put(`${this.baseURL}Product/update/${id}`,data,{withCredentials:true,responseType:"text"})
  }
  CreateProduct(data:any){
        return this.http.post(`${this.baseURL}Product/create`,data,{withCredentials:true})
  }
  DeleteProduct(id:number){
            return this.http.delete(`${this.baseURL}Product/${id}`,{withCredentials:true,responseType:"text"})
  }

  getAllTags() {
  return this.http.get<any[]>(`${this.baseURL}Tag`, { withCredentials: true });
}

 DeleteTag(id:number){
  return this.http.delete(`${this.baseURL}Tag/${id}`,{withCredentials:true});
 }
 FilterProductForId(tagId:number){
  return this.http.get(`${this.baseURL}Tag/${tagId}/products`,{withCredentials:true});
 }
 CreateTag(data:any){
  return this.http.post(`${this.baseURL}Tag`,data,{withCredentials:true});
 }
 updateTag(data:any,id:number){
  return this.http.put(`${this.baseURL}Tag/${id}`,data,{withCredentials:true});
 }
getAllOffers() {
  return this.http.get(`${this.baseURL}Offer`, { withCredentials: true });
}
CreateOffers(offer:any) {
  return this.http.post(`${this.baseURL}Offer`,offer, { withCredentials: true });
}
UpdateOffer(id:number,data:any) {
  return this.http.put(`${this.baseURL}Offer/${id}`,data,{ withCredentials: true });
}
getOneOffer(id:number) {
  return this.http.get(`${this.baseURL}Offer/${id}`, { withCredentials: true });
}
DeleteOffer(id:number){
    return this.http.delete(`${this.baseURL}Offer/${id}`, { withCredentials: true });

}

}
