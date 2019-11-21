/* https://material.io/design/color/#tools-for-picking-colors */

<template>
  <div id="app">
    <Header />
    <main>
        <GraphContainer />
        <ComponentB />
    </main>
  </div>
</template>

<script>
import GraphContainer from './components/GraphComponent/GraphContainer';
import Header from './components/Header';
import ComponentB from './components/componentB/componentB';

export default {
  name: 'app',

  data() { return {  }; },

  methods: {},

  components: {
     Header,
     GraphContainer,
     ComponentB
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
