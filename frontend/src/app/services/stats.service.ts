import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private httpClient = inject(HttpClient);

  getData(): any {
    return this.httpClient.get('https://139.144.79.67:3000/api/v1/stats')
  }

  getCurrentStatus(): Observable<any> {
    return this.httpClient.get('https://139.144.79.67:3000/api/v1/current-status')
  }
}
