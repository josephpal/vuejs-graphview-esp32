/* https://stuk.github.io/jszip/documentation/examples.html */
/* https://stackoverflow.com/questions/28299050/how-to-use-filesaver-js-with-canvas/28305948 */
/* https://www.npmjs.com/package/jszip */
/*  */

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
                                    :enabled="webSocketReady && ppmImgDrawed"
                                    @click="onSaveButtonClicked"
                                    :showSpinner="showSaveBtnSpinner" />
                  <RectangleButton  class="load-button"
                                    icon="load"
                                    :enabled="webSocketReady"
                                    @click="onLoadButtonClicked"
                                    :showSpinner="showLoadBtnSpinner" />
                  <RectangleButton  class="clear-button"
                                    icon="clear"
                                    :enabled="webSocketReady"
                                    @click="onClearButtonClicked"
                                    :showSpinner="showClearBtnSpinner" />
                  <RectangleButton  class="reboot-button"
                                    icon="reload"
                                    :enabled="webSocketReady"
                                    @click="onRebootButtonClicked"
                                    :showSpinner="showRebootBtnSpinner" />
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
  import { performRequest } from '../../utils/websocket/gateway'

  /* event bus for bidirectional communication between components */
  import { EventBus } from '../../utils/eventbus/event-bus.js';

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
        ppmImg: "",
        ppmImgDrawed: false,
        results: null,

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

      /* event bus callback listener -> will be called as an answer to EventBus.$emit('getIMGData') */
      EventBus.$on('returnIMGData', this.downloadResults);

      /* emulate websocket connection in development mode */
      __DEV__ === true ? this.webSocketReady = true : this.webSocketReady = false;
    },

    methods: {
      /* line chart functions */
      dummyData() {
        var data1 = [ " 42047", "21021", "21021", "15766", "16816", "14013", "15014", "13146", "" ];
        var data2 = [ "29647", "15675", "20349", "15398", "11871", "13127", "12728", "11435", "" ];

        this.displayReceivedChartData(data1, data2);
      },

      addData(data1, data2, data3, data4) {
        this.index = this.index + 1;
        this.labelArray.push(this.index);

        this.dataArray1.push(data1);
        this.dataArray2.push(data2);
        this.dataArray3.push(data3);
        this.dataArray4.push(data4);

        if (this.index > 16) {
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
              lineTension: 0,
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
              lineTension: 0,
              data: this.dataArray4
            }
          ]
        };
      },

      clearData() {
        /* TODO clear arrays and reset line charts to default */
      },

      displayReceivedChartData(dataSerie1, dataSerie2) {
        console.log("adding received data to charts ...");

        this.results = "";

        for(var i = 0; i < dataSerie1.length; i++) {
          if( dataSerie1[i] !== "") {
            this.results += dataSerie1[i] + ";"
          }
        }

        this.results += "\n ";

        for(var i = 0; i < dataSerie2.length; i++) {
          if( dataSerie2[i] !== "") {
            this.results += dataSerie2[i] + ";"
          }
        }

        for(var i = 0; i < dataSerie1.length; i++) {
          if( dataSerie1[i] !== "" && dataSerie2[i] !== "" ) {
            setTimeout( function( data1, data2, data3, data4 ) {
              this.addData( data1, data2, data3, data4 );
            }.bind(this), 500 * (i+1), dataSerie1[i], dataSerie1[0] / dataSerie1[i],
                          dataSerie2[i], dataSerie2[0] / dataSerie2[i]);
          }
        }

        console.log("-> done.");
      },

      /* websocket functions  */
      onSocketClose() {
        this.webSocketReady = false;
      },

      onSocketOpen() {
        this.webSocketReady = true;
      },

      onSocketMessage(message) {
        /* message can consist of SocketMessages.Type / data; in case of a get request */
        const type = message.split('/')[0];
        const msgData = message.split('/')[1];

        switch (type) {
          case SocketMessages.REBOOTING:
            /* process received results txt file */
            console.log("server backend is rebooting now ...");

            break;
          case SocketMessages.RECEIVED:
            /* process received results txt file */
            console.log("backend received data / instruction.");

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
        this.showSaveBtnSpinner = true;

        /* request to the Viewer component to return the canvas image */
        EventBus.$emit('getIMGData');
      },

      downloadResults(imgCanvas) {
        if( imgCanvas !== undefined) {
          /* converting the canvas pixel matrix to a binary large object (blob) */
          /* and generate a zip file containing the generated *ppm img as png and */
          /* the data from the line charts as a *.txt file */
          imgCanvas.toBlob( (blob) => (this.generateZipFile(blob)) );

        } else {
          console.error("Can't saved img as file!");
          this.showSaveBtnSpinner = false;
        }
      },

      generateZipFile(imgBlob) {
        /**
         * Results in a zip containing
         * results.txt
         * images/
         *    mandelbrot.png
        **/

        /* including jszip for creating a zip file */
        var JSZip = require("jszip");
        var zip = new JSZip();

        /* add a *.txt file to the zip containing the chart results */
        zip.file("results.txt", this.results);

        /* add a folder images/ */
        var img = zip.folder("images");

        /* store the img from canvas into the created folder images/ */
        img.file("mandelbrot.png", imgBlob, {base64: true});

        /*  */
        zip.generateAsync({type:"blob"}).then((content) => {
            /* filename generation: prefix + filename => YYYY-MM-DD - FLENAME.zip */
            let prefix = new Date().getFullYear() + "-"
                          + new Date().getMonth() + "-" + new Date().getDay() + " - ";

            /* using FileSaver.js to save the zip file to the user */
            saveAs(content, prefix + "evaluation.zip");

            this.showSaveBtnSpinner = false;
        }).catch(() => {
            console.error("zip file couldn't be created. Internal error!");

            this.showSaveBtnSpinner = false;
        });
      },

      onLoadButtonClicked() {
        this.showLoadBtnSpinner = true;

        if ( __DEV__ !== true ) {
          console.log("emit ppm data from graph container.");

          performRequest('GET', 'mandelbrot.ppm', null).then( (slug) => {
            this.ppmImageData = slug;
            this.$emit("data", this.ppmImageData);

            this.ppmImageData = "";
            this.ppmImgDrawed = true;

            performRequest('GET', 'results.txt', null).then( (slug) => {
              let resultsComputation = slug.split('\n')[0];
              let resultsMandelbrot = slug.split('\n')[1];

              let resultsComputationValues = resultsComputation.split(';');
              let resultsMandelbrotValues = resultsMandelbrot.split(';');

              console.log("received execution time arrays:");

              console.log(resultsComputationValues);
              console.log(resultsMandelbrotValues);

              this.displayReceivedChartData(resultsComputationValues, resultsMandelbrotValues);

              this.showLoadBtnSpinner = false;
            }).catch( () => {
              console.error("error while receiving *.txt file.");

              this.showLoadBtnSpinner = false;
            });
          }).catch( () => {
            console.error("error while receiving *.ppm image.");

            this.showLoadBtnSpinner = false;
          });

        } else {
          console.warn("running on development mode. Passing a local stored compressed file as a *.ppm image and a local result.txt file!");
          this.ppmImageData = mandelbrot;
          this.$emit("data", this.ppmImageData);

          this.ppmImageData = "";
          this.ppmImgDrawed = true;

          this.dummyData();

          this.showLoadBtnSpinner = false;
        }
      },

      onClearButtonClicked() {
        this.showClearBtnSpinner = true;

        this.ppmImgDrawed = false;
        EventBus.$emit('clearCanvas');

        this.showClearBtnSpinner = false;
      },

      onRebootButtonClicked() {
        this.showRebootBtnSpinner = true;

        /* TODO: send reboot to websocket server -> UI will shut down message?! */

        this.showRebootBtnSpinner = false;
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
