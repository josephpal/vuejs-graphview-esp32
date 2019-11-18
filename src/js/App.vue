/* https://material.io/design/color/#tools-for-picking-colors */

<template>
  <div id="app">
    <Header />
    <main>
        <ComponentA />
        <ComponentB />
    </main>
  </div>
</template>

<script>
import ComponentA from './components/componentA/componentA';
import Header from './components/Header';
import ComponentB from './components/componentB/componentB';

export default {
  name: 'app',

  data() { return {  }; },

  methods: {},

  components: {
     Header,
     ComponentA,
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
