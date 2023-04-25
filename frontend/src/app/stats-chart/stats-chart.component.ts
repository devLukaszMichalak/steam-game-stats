import {Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {BarController, BarElement, LinearScale, CategoryScale} from 'chart.js';

@Component({
  selector: 'app-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['./stats-chart.component.scss']
})
export class StatsChartComponent implements OnInit{

  private readonly data: any = {"2023-04-21":{"Dota 2":64,"Dying Light 2":340,"Counter-Strike: Global Offensive":29},"2023-04-23":{"Dying Light 2":314,"Team Fortress 2":65,"Counter-Strike: Global Offensive":15},"2023-04-22":{"Dying Light 2":188,"Team Fortress 2":220,"Counter-Strike: Global Offensive":32},"2023-04-20":{"Dying Light 2":38},"2023-04-24":{"Team Fortress 2":239}}
  private chart?: Chart;

  private getDays(): string[]{
    const days = Object.keys(this.data);
    return days;
  }

  private getDatasetsFromData(data: any) {
    const counts: any = {};

    for (const date of Object.keys(data)) {

      for (const game of Object.keys(data[date])) {

        counts[game] = counts[game] || [];
        counts[game].push(data[date][game]);
      }
    }

    const datasets = [];
    for (const game of Object.keys(counts)) {
      datasets.push({
        label: game,
        data: counts[game],
        backgroundColor: this.getRandomColor(),
        borderWidth: 1
      });
    }
    return datasets;
  }

  private getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }

  ngOnInit() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    Chart.register(BarController, BarElement, LinearScale, CategoryScale);
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.getDays(),
        datasets: this.getDatasetsFromData(this.data)
      },
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }
}
