import Vue from 'vue'
import Vuex from 'vuex'
import Contract from '@/store/modules/contract'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    contract: Contract
  },
  plugins: [createPersistedState()]
})
export default store