<template>
  <header>
    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico"/>
    <div class="inner">
      <img class="logo" src="../../assets/svg/logo.svg" />
    </div>
    <p>&#169; Copyright {{(new Date()).getFullYear()}}, F.J. Pal</p>
  </header>
</template>

<script>

export default {
  name: 'Header',

  computed: {

  },

  components: {

  }
};
</script>

<style lang="scss">
  @import '../../scss/variables/colors';

  header {
    height: $headerHeight;
    width: 100%;
    background-color: $colorThemeBlue;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .inner {
      display: flex;
      align-items: center;
      height: 100%;

      float: left;
      position: relative;
      width: 60%;

      .logo {
        height: 70%;
        width: auto;
      }

      .ft-connector {
        position: absolute;
        right: 38px;
      }
    }
  }
</style>
