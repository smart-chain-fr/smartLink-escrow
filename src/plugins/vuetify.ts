import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: { themes:{ light: { background : '#f8f9fd', primary: '#5a6099', forward: '#7128fc', back:'#454052', main: '#662cf2', DOMAIN_NAME:"#ecadd0", OTHER:"#afffda", OBJECT:"#ffe494", 'v-divider': '#ffffff6e'}} },
  })