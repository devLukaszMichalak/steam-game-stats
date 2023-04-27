import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private httpClient = inject(HttpClient);

  getData(): any {
    return this.httpClient.get('https://139.144.79.67:3000/api/v1/stats')
      .pipe(map(data => this.addMissingZeros(data)))
  }

  private addMissingZeros(data: any): any {
    let gameNames: string[] = [];

    Object.keys(data).forEach(date => {
      Object.keys(data[date]).forEach(gameName => {
        if (!gameNames.includes(gameName)) {
          gameNames.push(gameName);
        }
      })
    })

    Object.keys(data).forEach(date => {
      gameNames.filter(gameName => {
        if (!Object.keys(data[date]).includes(gameName)) {
          data[date][gameName] = 0;
        }
      })
    })

    return data;
  }
}
