<template>
    <div class="graph-container">
        <div class="content">
            <div class="button-container">

            </div>

            <div class="graphs">
                <div>
                    <line-chart :chart-data="datacollection1" class="chart"></line-chart>
                    <line-chart :chart-data="datacollection2" class="chart"></line-chart>
                </div>
                <div>
                    <line-chart :chart-data="datacollection3" class="chart"></line-chart>
                    <line-chart :chart-data="datacollection4" class="chart"></line-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    name: 'GraphContainer',

    data() {
      return {
        labelArray: [0],

        dataArray1: [0],
        dataArray2: [0],
        dataArray3: [0],
        dataArray4: [0],

        datacollection1: null,
        datacollection2: null,
        datacollection3: null,
        datacollection4: null,

        index: 0,
        interval: null
      };
    },

    mounted() {
      this.fillData();

      this.interval = setInterval(() => {
        this.addData();
      }, 500);
    },

    methods: {
      addData() {
        this.index = this.index + 0.5;
        this.labelArray.push(this.index);

        this.dataArray1.push((Math.random() * 90) + 10);
        this.dataArray2.push((Math.random() * 20) + 10);
        this.dataArray3.push((Math.random() * 50) + 10);
        this.dataArray4.push((Math.random() * 200) + 10);

        if (this.index > 6.5) {
          this.labelArray.shift();

          this.dataArray1.shift();
          this.dataArray2.shift();
          this.dataArray3.shift();
          this.dataArray4.shift();
        }

        this.fillData();
      },
      fillData() {
        this.datacollection1 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "data series 1",
              backgroundColor: "#f87979",
              data: this.dataArray1
            }
          ]
        };

        this.datacollection2 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "data series 2",
              backgroundColor: "#41b883",
              data: this.dataArray2
            }
          ]
        };

        this.datacollection3 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "data series 3",
              backgroundColor: "#303f9f",
              data: this.dataArray3
            }
          ]
        };

        this.datacollection4 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "data series 4",
              backgroundColor: "#35495e",
              data: this.dataArray4
            }
          ]
        };
      }
    },

    computed: {

    },

    components: {
      LineChart
    }
  };
</script>

<style lang="scss">
    @import '../../../scss/variables/colors';

    .graph-container {
      width: 60%;
      height: calc(100vh - #{$headerHeight});

      background-color: #E3F2FD;
      padding: 15px;

      .content {
        position: relative;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;

        .button-container {
          width: 8.5%;
          height: 100%;

          box-shadow: 2px 2px 4px $colorDarkGrey;
          color: #263238;

          cursor: pointer;
          transition: background-color .3s;

          &:hover {
            background-color: #BBDEFB;
          }
        }

        .graphs {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          
          width: 90%;
          height: 100%;

          box-shadow: 2px 2px 4px $colorDarkGrey;
          color: #263238;

          div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;

            width: 50%;

            .chart {
              heigth: 80%;
              width: 80%;
            }
          }

          cursor: pointer;
          transition: background-color .3s;

          &:hover {
            background-color: #BBDEFB;
          }
        }
      }
    }
</style>
