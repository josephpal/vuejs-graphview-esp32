/* https://www.chartjs.org/docs/latest/configuration/legend.html */

import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "xAxisLabel", "yAxisLabel"],
  data() {
    return {
      options: {
        //Chart.js options
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },

              gridLines: {
                display: true
              },

              scaleLabel: {
                display: true,
                labelString: (typeof this.yAxisLabel === 'undefined' ? 'value' : this.yAxisLabel)
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: false
              },

              gridLines: {
                display: false
              },

              scaleLabel: {
                display: true,
                labelString: (typeof this.xAxisLabel === 'undefined' ? 'ticks in seconds / s' : this.xAxisLabel)
              }
            }
          ]
        },

        legend: {
          display: true
        },

        responsive: true,
        maintainAspectRatio: false
      }
    };
  },

  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
};
