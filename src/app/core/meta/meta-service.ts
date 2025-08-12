import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(
    private meta:Meta,
    private router:Router,
    private route:ActivatedRoute
  ) { }
  setMeta(){

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      let route = this.route;
      while (route.firstChild) route = route.firstChild;
      return route;
    }),
    mergeMap(route => route.data)
  ).subscribe(data => {
    this.meta.updateTag({ name: 'description', content: data['description'] || 'الوصف الافتراضي' });
    this.meta.updateTag({ property: 'og:title', content: data['title'] || 'العنوان الافتراضي' });
  });
  }


}
