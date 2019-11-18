<template>
  <div class="componentB">
    <div class="content">Component B!</div>
  </div>
</template>

<script>

  export default {
    name: 'ComponentB',

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
            //background-color: #BBDEFB;
            color: #263238;
            height: 100%;
        }
    }
</style>
