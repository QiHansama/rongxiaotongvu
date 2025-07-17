import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage, // 默认用 localStorage
      key: 'loginName' // 存储的键名
    })
  ],
  state: {
    changedOrderId:0,
    loginName:''
  },
  getters: {
  },
  mutations: {
    updateOrder(state,value){
      state.changedOrderId=value
    },

    loginUserNickname(state,value){
      state.loginName = value
    },
    // 删除token
    removeStorage(state) {
      localStorage.removeItem('token');
    },
  },
  actions: {
  },
  modules: {
  }
})
