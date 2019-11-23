<template>
  <button class="round-button" :class="[!enabled ? 'disabled' : '', size]" @click="onClicked">
    <Spinner v-if="showSpinner"/>
    <svg class="icon" v-else>
      <use :href="iconPath"></use>
    </svg>
  </button>
</template>

<script>
  import Spinner from './Spinner';
  import sprites from '../../../assets/svg/sprites.svg';

  export default {
    name: 'RectangleButton',

    props: {
      enabled: {
        type: Boolean,
        default: true,
      },
      icon: {
        type: String,
        required: true
      },
      showSpinner: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: "lg",
        validator: (value) => ( ["sm","md","lg"].includes(value) )
      }
    },

    computed: {
      iconPath() {
        return `${sprites}#${this.icon}`;
      }
    },

    methods: {
      onClicked() {
        if (this.enabled && !this.showSpinner) {
          this.$emit('click');
        }
      }
    },

      components: {
          Spinner,
      },
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

  .round-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10%;
    border: 0;
    outline: 0;
    color: #fff;
    cursor: pointer;
    box-shadow: 2px 2px 4px $colorDarkGrey;
    background-color: rgba($colorThemeBlue, .9);
    transition: background-color .3s;

    &:hover {
      border: 0;
      background-color: $colorThemeBlue;
    }

    &.disabled {
      background-color: rgba($colorMediumGrey, .4);
      color: hsla(0, 0, 0, .4);
      cursor: default;
    }

    &.sm {
      width: 24px;
      height: 24px;
    }

    &.md {
      width: 32px;
      height: 32px;
    }

    &.lg {
      width: 60px;
      height: 60px;

      @media (max-width: 1700px) {
        width: 50px;
        height: 50px;
      }
    }

    .icon {
      fill: #fff;
      width: auto;
      height: 80%;
      max-height: 20px;

      @media (max-width: 1700px) {
        width: auto;
        height: 35%;
      }
    }
  }
</style>
