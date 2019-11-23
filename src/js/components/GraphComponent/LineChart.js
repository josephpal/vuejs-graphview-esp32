import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData"],
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
                labelString: 'value'
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
                labelString: 'ticks in seconds / s'
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
