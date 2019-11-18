import Vue from 'vue';
import App from './App';
import Vuebar from 'vuebar';

import '../assets/fonts/roboto.css';
import '../scss/app.scss';

Vue.config.productionTip = false;

Vue.use(Vuebar);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App,
  },
});
