import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit, OnDestroy {

  private chartInstance: Chart | null = null;

  // Datos de ejemplo para cada rango
  private chartData = {
    week: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      data: [12, 19, 8, 15, 22, 30, 18]
    },
    month: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      data: [65, 78, 92, 110]
    },
    year: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      data: [450, 520, 480, 610, 720, 850, 920, 880, 950, 1020, 980, 1100]
    }
  };

  // Rango activo por defecto
  activeRange: 'week' | 'month' | 'year' = 'week';

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  changeRange(range: 'week' | 'month' | 'year') {
    this.activeRange = range;
    this.createChart();
  }

  private createChart() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    // Destruir gráfico anterior si existe
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const currentData = this.chartData[this.activeRange];

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: [
          {
            label: 'Usuarios activos',
            data: currentData.data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 14 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Usuarios activos'
            }
          },
          x: {
            title: {
              display: true,
              text: this.getXAxisTitle()
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  private getXAxisTitle(): string {
    switch (this.activeRange) {
      case 'week':  return 'Días de la semana';
      case 'month': return 'Semanas del mes';
      case 'year':  return 'Meses del año';
      default:      return 'Período';
    }
  }
}