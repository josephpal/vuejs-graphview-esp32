/* https://material.io/design/color/#tools-for-picking-colors */

<template>
  <div id="app">
    <Header />
    <main>
        <GraphContainer />
        <MandelbrotViewer />
    </main>
  </div>
</template>

<script>
import GraphContainer from './components/GraphComponent/GraphContainer';
import Header from './components/Header';
import MandelbrotViewer from './components/MandelbrotComponent/MandelbrotViewer';

export default {
  name: 'app',

  data() { return {  }; },

  methods: {},

  components: {
     Header,
     GraphContainer,
     MandelbrotViewer
  }
};
</script>

<style lang="scss">
  #app {
    main {
      display: flex;
    }
  }
</style>
