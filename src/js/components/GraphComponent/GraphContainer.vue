<template>
    <div class="graph-container">
        <div class="content">
            <div class="button-container">
                <div class="buttons">
                  <RectangleButton  class=""
                                    icon="save"
                                    :enabled="true"
                                    @click=""
                                    :showSpinner="false" />
                  <RectangleButton  class=""
                                    icon="load"
                                    :enabled="true"
                                    @click="emitPPMData"
                                    :showSpinner="false" />
                  <RectangleButton  class=""
                                    icon="arrow"
                                    :enabled="true"
                                    @click=""
                                    :showSpinner="false" />
                </div>
            </div>

            <div class='graphs'>
                <div class='row'>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection1" class="chart" style="height: 95%; width: 95%;"></line-chart>
                        </div>
                    </div>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection2" class="chart" style="height: 95%; width: 95%;"></line-chart>
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection3" class="chart" style="height: 95%; width: 95%;"></line-chart>
                        </div>
                    </div>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection4" class="chart" style="height: 95%; width: 95%;"></line-chart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import RectangleButton from '../buttons/RectangleButton'

  /* as an example of emitting the received ppm file */
  import { mandelbrot } from '../../utils/MandelbrotExample';

  export default {
    name: 'GraphContainer',

    data() {
      return {
        /* graph properties */
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
        interval: null,

        /* values */
        ppmImageData: "",
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
        this.index = this.index + 1;
        this.labelArray.push(this.index);

        this.dataArray1.push((Math.random() * 90) + 10);
        this.dataArray2.push((Math.random() * 20) + 10);
        this.dataArray3.push((Math.random() * 50) + 10);
        this.dataArray4.push((Math.random() * 200) + 10);

        if (this.index > 13) {
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
      },

      emitPPMData() {
        console.log("emit ppm data from graph container.");

        this.ppmImageData = mandelbrot;
        this.$emit("data", this.ppmImageData);

        this.ppmImageData = "";
      }
    },

    computed: {

    },

    components: {
      LineChart,
      RectangleButton
    }
  };
</script>

<style lang="scss">
    @import '../../../scss/variables/colors';
    @import '../../../scss/mixins/breakpoints';

    .graph-container {
      width: 60%;
      height: calc(100vh - #{$headerHeight});

      background-color: $backgroundColor;
      padding: 15px;
    }

    .content {
      position: relative;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
    }

    .button-container {
      width: 8.5%;
      height: 100%;

      padding: 0 15px;

      box-shadow: 2px 2px 4px $colorDarkGrey;
    }

    .buttons {
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      flex-direction: column;

      .round-button {
        margin-top: 15px;
      }
    }

    .graphs {
      width: calc(91.5% - 15px);
      height: 100%;

      padding: 15px;

      box-shadow: 2px 2px 4px $colorDarkGrey;
      color: #263238;

      cursor: pointer;
      transition: background-color .3s;

      &:hover {
        background-color: #BBDEFB;
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      height: 50%;
      width: 100%;
    }

    .column {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
      flex: 1;
    }

    .item {
      height: 100%;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
    }
</style>
