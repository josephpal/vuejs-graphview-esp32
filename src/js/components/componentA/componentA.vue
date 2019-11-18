<template>
  <div class="componentA">
    <div class="content" @click="clicked">Component A</div>
  </div>
</template>

<script>

  export default {
    name: 'ComponentA',

    data() {
      return {

      };
    },

    props: {

    },

    mounted() {

    },

    computed: {

    },

    methods: {
        clicked() {
          console.log("componentA clicked!");
        }
    },

    components: {

    }
  };
</script>

<style lang="scss">
    @import '../../../scss/variables/colors';

    .componentA {
      width: 60%;
      height: calc(100vh - #{$headerHeight});

      background-color: #E3F2FD;
      padding: 15px;

      .content {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        box-shadow: 2px 2px 4px $colorDarkGrey;

        color: #263238;
        height: 100%;

        cursor: pointer;
        transition: background-color .3s;

        &:hover {
          background-color: #BBDEFB;
        }
      }
    }
</style>
