import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {BarController, BarElement, CategoryScale, Chart, Legend, LinearScale} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StatsService} from "../../services/stats.service";
import {take} from "rxjs";

@Component({
  selector: 'app-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['./stats-chart.component.scss']
})
export class StatsChartComponent implements OnInit {

  statsService = inject(StatsService);

  @Output()
  promptForCertificate = new EventEmitter<boolean>();

  status?: string;
  sliderMinValue: number = 1;
  sliderMaxValue?: number;
  sliderValue?: number;

  private chartData: any = {};

  private chart?: Chart;

  ngOnInit() {
    this.statsService.getData().pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.chartData = data;
          this.sliderMaxValue = Object.keys(data).length;
          this.sliderValue = this.sliderMaxValue;
          Chart.register(BarController, BarElement, LinearScale, CategoryScale, Legend, ChartDataLabels);
          this.setChart(data);
        },
        error: (err: any) => {
          this.promptForCertificate.emit(true);
        }
      });
    this.statsService.getCurrentStatus().pipe(take(1))
      .subscribe(res => this.status = res.status)
  }

  private setChart(data: any) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.getDays(data),
        datasets: this.getDatasetsFromData(data)
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "bottom"
          },
          datalabels: {
            color: '#000505',
            textAlign: 'center',
            formatter: function (value, context) {
              if (value === 0) {
                return '';
              } else {
                if (value > 60) {
                  const minutes = value % 60;
                  const hours = Math.floor(value / 60);
                  if (minutes === 0) {
                    return `${hours} h`
                  } else {
                    return `${hours} h\n${minutes} min`
                  }
                } else {
                  return `${value} min`;
                }
              }
            },
            font: {
              weight: 'bold',
              size: 18
            }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return parseInt('' + value) / 60;
              },
              stepSize: 60
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private getDays(data: any): string[] {
    return Object.keys(data);
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
      const color = this.getRandomColor();
      datasets.push({
        label: game,
        data: counts[game],
        backgroundColor: color,
        borderWidth: 4,
        borderColor: color.replace(`0.4`, `0.55`)
      });
    }
    return datasets;
  }

  private getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.4)`;
  }

  updateGraphRange() {
    const dates = Object.keys(this.chartData).sort();
    const adjustedDates  = dates.slice(-this.sliderValue);

    let adjustedRangeData: any = {};
    for (let i = 0; i < adjustedDates.length; i++) {
      adjustedRangeData[adjustedDates[i]] = this.chartData[adjustedDates[i]]
    }

    this.chart!.data! = {
      labels: this.getDays(adjustedRangeData),
      datasets: this.getDatasetsFromData(adjustedRangeData)
    };
    this.chart?.update();
  }

}
