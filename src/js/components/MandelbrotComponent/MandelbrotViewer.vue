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
  import mandelbrotImg from '../../../assets/pic/mandelbrot.jpeg';
  import { mandelbrot } from '../../utils/MandelbrotExample';


  export default {
    name: 'MandelbrotViewer',

    data() {
      return {
        configKonva: {
          width: 600,
          height: 600
        },

        convertedImage: null,
      };
    },

    props: {
      ppmImageData: {
        type: String
      }
    },

    mounted() {

    },

    watch: {
      ppmImageData: function() {
          if (this.ppmImageData !== "") {
              console.log("receiving ppm image data in viewer component.");
              this.clearCanvas();
              this.drawPPMImage(this.ppmImageData);
          } else {

          }
      }
    },

    computed: {

    },

    methods: {
      drawCircle() {
        console.log("drawing circle ...");

        // first we need to create a stage
        var stage = new Konva.Stage({
          container: 'container',   // id of container <div>
          width: this.configKonva.width,
          height: this.configKonva.height
        });

        // then create layer
        var layer = new Konva.Layer();

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

        // first we need to create a stage
        var stage = new Konva.Stage({
          container: 'container',   // id of container <div>
          width: this.configKonva.width,
          height: this.configKonva.height
        });

        // then create layer
        var layer = new Konva.Layer();

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
          layer.add(img);

          // add the layer to the stage
          stage.add(layer);

          // draw the image
          layer.batchDraw();
        };

        imageObj.src = mandelbrotImg;

      },

      drawPPMImage(ppmImage) {
        console.log("drawing ppm pixel image...");

        // first we need to create a stage
        var stage = new Konva.Stage({
          container: 'container',   // id of container <div>
          width: this.configKonva.width,
          height: this.configKonva.height
        });

        // then create layer
        var layer = new Konva.Layer();

        // add the layer to the stage
        stage.add(layer);

        // get canvas context from konva layer
        var c = layer.getCanvas()._canvas;
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

            // loop through the pixels
            for (var j = 0; j < this.configKonva.height; j+=1) {
              for (var i = 0; i < this.configKonva.width; i+=1) {
                  var d  = id.data;

                  // r g b values for the color of the pixel
                  d[0]   = ppmArray[j][i][0];
                  d[1]   = ppmArray[j][i][1];
                  d[2]   = ppmArray[j][i][2];
                  d[3]   = 255;

                  // draw the pixel
                  ctx.putImageData( id, i, j );
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

          // first we need to create a stage
          var stage = new Konva.Stage({
            container: 'container',   // id of container <div>
            width: this.configKonva.width,
            height: this.configKonva.height
          });

          // then create layer
          var layer = new Konva.Layer();

          // add the layer to the stage
          stage.add(layer);

          // get canvas context from konva layer
          var c = layer.getCanvas()._canvas;
          var ctx = c.getContext('2d');

          ctx.clearRect(0, 0, this.configKonva.width, this.configKonva.height);
      }
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
