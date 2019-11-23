import Vue from 'vue';
import App from './App';

import Vuebar from 'vuebar';
import VueKonva from 'vue-konva'

import '../assets/fonts/roboto.css';
import '../scss/app.scss';

Vue.config.productionTip = false;

Vue.use(Vuebar);
Vue.use(VueKonva);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App,
  },
});
