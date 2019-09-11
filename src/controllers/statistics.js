import Statistics from '../components/statistics.js';
import {Position, render, unrender} from '../utils.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class StatisticsController {
  constructor(container) {
    this._container = container;
    this._statistics = new Statistics();
    this._tasks = [];

    this.create();
  }

  create() {
    const startOfweek = moment().startOf('isoWeek').format(`DD MMM`);
    const endOfweek = moment().endOf('isoWeek').format(`DD MMM`);
  
    flatpickr(this._statistics.getElement().querySelector(`.statistic__period-input`), {
      mode: `range`,
      dateFormat: `d M`,
      defaultDate: [startOfweek, endOfweek]
    });

    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
  }

  show(tasks) {
    this._tasks = tasks.filter(({isArchive}) => isArchive);
    this._statistics.getElement().classList.remove(`visually-hidden`);
    this._chartDayInit();
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  _getChartData(start, end) {
      

      
  }

  _chartInit() {
    const tagsCtx = this._statistics.getElement().querySelector(`.statistic__tags`);
    const colorsCtx = this._statistics.getElement().querySelector(`.statistic__colors`);
    
    
    
    const tagsChart = new Chart(tagsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: [`#watchstreams`, `#relaxation`, `#coding`, `#sleep`, `#watermelonpies`],
        datasets: [{
          data: [20, 15, 10, 5, 2],
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
    
    const colorsChart = new Chart(colorsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: [`#pink`, `#yellow`, `#blue`, `#black`, `#green`],
        datasets: [{
          data: [5, 25, 15, 10, 30],
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    })
  }

  _chartDayInit() {
    const daysCtx = this._statistics.getElement().querySelector(`.statistic__days`);

    const taskDays = this._tasks.map((task) => task.dueDate).sort((a, b) => b - a);
    const chartData = taskDays.reduce(function(acc, currentValue) {
        const index = acc.findIndex((el) => el[`date`] === currentValue);
        if (index !== -1) { 
            acc[index].count++;
        } else {
            acc.push({
                date: currentValue,
                count: 1
            });
        }
        return acc;
      }, []);

    const labels = chartData.map((el) => el.date);
    const data = chartData.map((el) => el.count);
    console.log(data);
    console.log(labels);

    const daysChart = new Chart(daysCtx, {
        plugins: [ChartDataLabels],
        type: `line`,
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: `transparent`,
            borderColor: `#000000`,
            borderWidth: 1,
            lineTension: 0,
            pointRadius: 8,
            pointHoverRadius: 8,
            pointBackgroundColor: `#000000`
          }]
        },
        options: {
          plugins: {
            datalabels: {
              font: {
                size: 8
              },
              color: `#ffffff`
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true,
                display: false
              },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                  unit: `day`,
                  displayFormats: {
                     day: `DD MMM`
                  }
              },
              ticks: {
                fontStyle: `bold`,
                fontColor: `#000000`
              },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }]
          },
          legend: {
            display: false
          },
          layout: {
            padding: {
              top: 10
            }
          },
          tooltips: {
            enabled: false
          }
        }
      });

  }

}
