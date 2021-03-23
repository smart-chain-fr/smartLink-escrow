import Vue from 'vue'
import Vuex from 'vuex'
import Contract from '@/store/modules/contract'
import User from '@/store/modules/user'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    contract: Contract,
    user: User
  },
  plugins: [createPersistedState()]
})
export default store