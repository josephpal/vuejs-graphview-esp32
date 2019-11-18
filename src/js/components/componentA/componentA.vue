<template>
  <div class="componentA">
    <div class="content">Component A!</div>
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
            //background-color: #BBDEFB;
            color: #263238;
            height: 100%;
        }
    }
</style>
