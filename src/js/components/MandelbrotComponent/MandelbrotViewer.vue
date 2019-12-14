/* usefull web pages: */
/* https://konvajs.org/docs/shapes/Rect.html */
/* https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas */
/* https://pastebin.com/4ijVKJcC */
/* https://compile.fi/canvas-filled-three-ways-js-webassembly-and-webgl/ */
/* https://stackoverflow.com/questions/41648026/combine-several-imagedata-structures-into-one-canvas */
/* https://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js */
/* https://stackoverflow.com/questions/37170225/bind-function-meaning-in-vuejs */
/* https://github.com/mikolalysenko/ppm */
/* https://en.wikipedia.org/wiki/Netpbm_format */
/* https://codingexplained.com/coding/front-end/vue-js/working-with-methods-in-vue-js */
/* https://medium.com/javascript-in-plain-english/avoid-mutating-a-prop-directly-7b127b9bca5b */
/* https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing */
/* https://dev.to/alexmourer/sharing-data-between-components-invuejs-48me */
/* https://www.w3schools.com/jsref/jsref_split.asp */
/* https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank */
/* https://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf */

<template>
    <div class="mandelbrot-viewer">
        <div class="content">
          <v-stage :config="configKonva" id="container">
              <v-layer />
          </v-stage>
        </div>
    </div>
</template>

<script>
  /* mandelbrot images examples (as jpeg with color gradient and a compressed version created with the esp32) */
  import mandelbrotImg from '../../../assets/pic/mandelbrot.jpeg';
  import { mandelbrot } from '../../utils/MandelbrotExample';

  /* helper functions */
  import { dec2Binary, gd } from '../../utils/helperFunctions'

  /* event bus for bidirectional communication between components */
  import { EventBus } from '../../utils/eventbus/event-bus.js';

  export default {
    name: 'MandelbrotViewer',

    data() {
      return {
        configKonva: {
          width: 600,
          height: 600
        },

        convertedImage: null,

        stage: null,
        layer: null,
      };
    },

    props: {
      ppmImageData: {
        type: String
      }
    },

    mounted() {
      /* event bus callback listener */
      EventBus.$on('getIMGData', this.returnIMGData);
      EventBus.$on('clearCanvas', this.clearCanvas);

      this.createKonvaLayer();
    },

    watch: {
      ppmImageData: function() {
          if (this.ppmImageData.length !== 0) {
              console.log("receiving ppm image data in viewer component.");

              /* clearing canvas */
              this.clearCanvas();

              /* decompress image -> result will be stored in template prop! */
              this.decompressImage(this.ppmImageData);

              /* draw decompressed pixel *.ppm image */
              this.drawPPMImage(this.convertedImage, true);
          }
      }
    },

    computed: {

    },

    methods: {
      createKonvaLayer() {
        // first we need to create a stage
        this.stage = new Konva.Stage({
          container: 'container',   // id of container <div>
          width: this.configKonva.width,
          height: this.configKonva.height
        });

        // then create layer
        this.layer = new Konva.Layer();

        // add the layer to the stage
        this.stage.add(this.layer);
      },

      drawCircle() {
        console.log("drawing circle ...");

        // create our shape
        var circle = new Konva.Circle({
          x: stage.width() / 2,
          y: stage.height() / 2,
          radius: 70,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4
        });

        // add the shape to the layer
        layer.add(circle);

        // add the layer to the stage
        stage.add(layer);

        // draw the image
        layer.draw();
      },

      drawImage() {
        console.log("drawing mandelbrot image ...");

        // main API:
        var imageObj = new Image();
        imageObj.onload = function() {
          var img = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: 500,
            height: 500
          });

          // add the shape to the layer
          this.layer.add(img);

          // add the layer to the stage
          this.stage.add(layer);

          // draw the image
          this.layer.batchDraw();
        };

        imageObj.src = mandelbrotImg;

      },

      drawPPMImage(ppmImage, rotate) {
        console.log("drawing ppm pixel image...");

        // get canvas context from konva layer
        var c = this.layer.getCanvas()._canvas;
        var ctx = c.getContext('2d');

        // generate and 1x1 image data object (pixel), which will be drawn directly on canvas using
        // native conavas methods and not the knova way
        var id = ctx.createImageData(1,1);

        // load ppm deserialize library
        var ppm = require("ppm");

        // create a readable stream of a string
        const Readable = require('stream').Readable;
        const data = new Readable();

        // data string (mandelbrot image as ppm file)
        data.push(ppmImage);
        data.push(null);

        // parse ppm file to array
        ppm.parse(data, function (err, ppmArray) {
            console.log("parsing ppm file done.");
            console.log(ppmArray);

            // loop through the pixels
            for (var j = 0; j < this.configKonva.height; j+=1) {
              for (var i = 0; i < this.configKonva.width; i+=1) {
                  var d = id.data;

                  // r g b values for the color of the pixel
                  d[0] = ppmArray[j][i][0];
                  d[1] = ppmArray[j][i][1];
                  d[2] = ppmArray[j][i][2];
                  d[3] = 255;

                  // draw the pixel
                  ctx.putImageData( id, !rotate ? i : j, !rotate ? j : i );
              }
            }

            // drawing the pixel matrix is done
            console.log("drawing pixel matrix done.");

            // clear prop data cache
            this.$emit("clearData", "");
        }.bind(this));
      },

      clearCanvas() {
          console.log("clearing canvas.");

          // get canvas context from konva layer
          var c = this.layer.getCanvas()._canvas;
          var ctx = c.getContext('2d');

          // clear pixels
          ctx.clearRect(0, 0, this.configKonva.width, this.configKonva.height);

          // clear props
          this.convertedImage = null;
      },

      decompressImage(compressedPPMData) {
          console.log("decompressing *.ppm image data ...");

          this.convertedImage = "";

          console.log("reading header information ...");
          let ppmFileFormat;
          let width;
          let height;
          let maxColor;
          let combinedBits;
          let uncompressedDataStream = "";

          let line = "";
          let index = 0;

          for (var i = 0; i < compressedPPMData.length; i++) {
              line += compressedPPMData[i];

              if(compressedPPMData[i] === '\n' || (i === compressedPPMData.length - 1)) {
                  switch (index) {
                      case 0:
                          ppmFileFormat = line;
                          break;
                      case 1:
                          var splitLine = line.split(" ");
                          width = parseInt(splitLine[0]);
                          height = parseInt(splitLine[1]);

                          combinedBits = gd(width, 30);
                          break;
                      case 2:
                          maxColor = parseInt(line);
                          break;
                      case 3:
                          /* blank line, time to print the header information */
                          console.log("PPM format: " + ppmFileFormat);
                          console.log("width: " + width);
                          console.log("height: " + height);
                          console.log("compression level (bits combined): " + combinedBits);
                          console.log("max color code: " + maxColor + " -> changing to " + 255);

                          maxColor = 255;

                          console.log("Uncompressing ...");
                          this.convertedImage = ppmFileFormat + "\n" + width + " " + height + "\n" + maxColor + "\n" + "\n";

                          break;

                      default:
                          let uncompressedData = dec2Binary(line, combinedBits);
                          uncompressedDataStream += uncompressedData;

                          for (var j = 0; j < combinedBits; j++) {
                            if ( uncompressedData[j] === '1' ) {
                							  this.convertedImage += "255" + " " + "0" + " " + "0" + "\n";
                						} else {
                							  this.convertedImage += "0" + " " + "0" + " " + "0" + "\n";
                						}
                          }
                  }

                  line = "";
                  index++;
              }
          }

          console.log("Decompressed " + compressedPPMData.length + " to "
                                      + uncompressedDataStream.length + " characters -> done.");
      },

      returnIMGData() {
        // get canvas context from konva layer
        var c = this.layer.getCanvas()._canvas;

        if ( this.isCanvasBlank(c) === true ) {
          console.error("canvas is empty. Nothing to save!");
          EventBus.$emit('returnIMGData');
        } else {
          console.log("returning img data from canvas ...");

          var imgCanvas = c;

          EventBus.$emit('returnIMGData', imgCanvas);
        }
      },

      isCanvasBlank(canvas) {
        const context = canvas.getContext('2d');

        const pixelBuffer = new Uint32Array(
          context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );

        return !pixelBuffer.some(color => color !== 0);
      },
    },

    components: {

    }
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';

  .mandelbrot-viewer {
    width: 40%;
    height: calc(100vh - #{$headerHeight});

    background-color: #E3F2FD;
    padding: 15px;
    padding-left: 0px;

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 4px $colorDarkGrey;
      height: 100%;

      cursor: pointer;
      transition: background-color .3s;

      &:hover {
        background-color: #BBDEFB;
      }
    }
  }
</style>
