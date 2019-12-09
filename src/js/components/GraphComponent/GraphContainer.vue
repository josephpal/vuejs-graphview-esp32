<template>
    <div class="graph-container">
        <div class="content">
            <div class="button-container">
                <div class="buttons">
                  <RectangleButton  class="connect-button"
                                    :icon="connectButtonIcon"
                                    :enabled="!webSocketConnecting"
                                    @click="onConnectButtonClicked"
                                    :showSpinner="showConnectBtnSpinner" />
                  <RectangleButton  class="save-button"
                                    icon="save"
                                    :enabled="webSocketReady"
                                    @click="onSaveButtonClicked"
                                    :showSpinner="false" />
                  <RectangleButton  class="load-button"
                                    icon="load"
                                    :enabled="webSocketReady"
                                    @click="emitPPMData"
                                    :showSpinner="false" />
                  <RectangleButton  class="clear-button"
                                    icon="clear"
                                    :enabled="webSocketReady"
                                    @click="onClearButtonClicked"
                                    :showSpinner="false" />
                  <RectangleButton  class="reboot-button"
                                    icon="reload"
                                    :enabled="webSocketReady"
                                    @click="onRebootButtonClicked"
                                    :showSpinner="false" />
                </div>
            </div>

            <div class='graphs'>
                <div class='row'>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection1"
                                        xAxisLabel="number of threads"
                                        yAxisLabel="time  t{p}  /  ms"
                                        class="chart"
                                        style="height: 95%; width: 95%;" />
                        </div>
                    </div>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection2"
                                        xAxisLabel="number of threads"
                                        yAxisLabel="Speedup  S  =  t{1}  /  t{p}"
                                        class="chart"
                                        style="height: 95%; width: 95%;" />
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection3"
                                        xAxisLabel="number of threads"
                                        yAxisLabel="time  t{p}  /  ms"
                                        class="chart"
                                        style="height: 95%; width: 95%;" />
                        </div>
                    </div>
                    <div class='column'>
                        <div class='item'>
                            <line-chart :chart-data="datacollection4"
                                        xAxisLabel="number of threads"
                                        yAxisLabel="Speedup  S  =  t{1}  /  t{p}"
                                        class="chart"
                                        style="height: 95%; width: 95%;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  /* as an example of emitting the received compressed *.ppm file */
  import { mandelbrot } from '../../utils/MandelbrotExample';

  import LineChart from './LineChart.js'
  import RectangleButton from '../buttons/RectangleButton'
  import saveAs from '../../utils/FileSaver';

  /* websocket connection javascript files */
  import SocketMessages from '../../utils/websocket/SocketMessageTypes';
  import socketConnector from '../../utils/websocket/socketConnector';
  import { validateIp, isEmpty } from '../../utils/websocket/validationUtils'

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

        /* websocket */
        ip: "192.168.4.1",
        webSocketReady: false,
        webSocketConnecting: false,

        /* button spinner state */
        showConnectBtnSpinner: false,
        showSaveBtnSpinner: false,
        showLoadBtnSpinner: false,
        showClearBtnSpinner: false,
        showRebootBtnSpinner: false,
      };
    },

    mounted() {
      /* default websocket function call if connection is closed, open ore a new message is received */
      socketConnector.onClose(this.onSocketClose);
      socketConnector.onOpen(this.onSocketOpen);
      socketConnector.onMessage(this.onSocketMessage);

      /* render line charts with default settings  */
      this.fillData();

      /* test routine to add random data to the line charts every 500ms */
      /*this.interval = setInterval(() => {
          this.addData();
      }, 500);*/
    },

    methods: {
      /* line chart functions */
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
              label: "execution time [Computation]",
              backgroundColor: "#f87979",
              data: this.dataArray1
            }
          ]
        };

        this.datacollection2 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "speedup factor [Computation]",
              backgroundColor: "#41b883",
              data: this.dataArray2
            }
          ]
        };

        this.datacollection3 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "execution time [Mandelbrot]",
              backgroundColor: "#303f9f",
              data: this.dataArray3
            }
          ]
        };

        this.datacollection4 = {
          labels: this.labelArray,
          datasets: [
            {
              label: "speedup factor [Mandelbrot]",
              backgroundColor: "#35495e",
              data: this.dataArray4
            }
          ]
        };
      },


      /* websocket functions  */
      onSocketClose() {
        this.webSocketReady = false;
      },

      onSocketOpen() {
        this.webSocketReady = true;
      },

      onSocketMessage(message) {
        //console.warn(message);
        console.log(`Received message: ${message}`);
        switch (message) {
          case SocketMessages.RUNNING:
            this.isReady = true;
            this.isRunning = true;
            this.isPaused = false;
            break;
          case SocketMessages.READY:
            this.isReady = true;
            break;
          case SocketMessages.ERROR:
            console.error('Server error');
            break;
          default:
            console.warn('Unknown socket message');
            break;
        }
      },


      /* button clicked functions */
      onConnectButtonClicked() {
        if( !this.webSocketReady ) {
          if( !validateIp(this.ip) ) {
            /* IP adress is not valid */
            console.log("Invalid IP address!");
            this.webSocketConnecting = false;
          } else {
            if( this.webSocketConnecting != true ) {
              this.webSocketConnecting = true;
              console.log('Connect to websocket ...');
              this.openWebsocketConnection();
            } else {
              console.log('Connection process still running!');
            }
          }
        } else {
            socketConnector.close();
            this.webSocketConnecting = false;
        }
      },

      openWebsocketConnection() {
        this.showConnectBtnSpinner = true;

        socketConnector.connect(this.ip).then(() => {
          this.webSocketReady = true;
          this.showConnectBtnSpinner = false;
          this.webSocketConnecting = false;
        }).catch(() => {
          this.showConnectBtnSpinner = false;
          this.webSocketReady = false;
          this.webSocketConnecting = false;

          console.error("Could not connect to websocket " + this.ip + "!");
        });
      },

      onSaveButtonClicked() {

      },

      emitPPMData() {
        console.log("emit ppm data from graph container.");

        this.ppmImageData = mandelbrot;
        this.$emit("data", this.ppmImageData);

        this.ppmImageData = "";
      },

      onClearButtonClicked() {
        this.ppmImageData = "clear";
        this.$emit("data", this.ppmImageData);

        this.ppmImageData = "";
      },

      onRebootButtonClicked() {

      },
    },

    computed: {
      connectButtonIcon() {
        return this.webSocketReady ? 'disconnect' : 'connect';
      }
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
