<template>
    <div class="componentB">
        <div class="content">
          <v-stage :config="configKonva" id="container">
              <v-layer>
                  <!--<v-circle :config="configCircle"></v-circle> #Method 1 -->
              </v-layer>
          </v-stage>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'ComponentB',

    data() {
      return {
        configKonva: {
          width: 500,
          height: 500
        },
        configCircle: {
          x: 100,
          y: 100,
          radius: 70,
          fill: "red",
          stroke: "black",
          strokeWidth: 4
        }
      };
    },

    props: {

    },

    mounted() {
      this.drawCircle();
    },

    computed: {

    },

    methods: {
      drawCircle() {
        console.log("drawing circle ...");

        // first we need to create a stage
        var stage = new Konva.Stage({
          container: 'container',   // id of container <div>
          width: 500,
          height: 500
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
      }
    },

    components: {

    }
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';

  .componentB {
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
