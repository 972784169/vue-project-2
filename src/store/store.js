/**
 * Created by Administrator on 2019/6/27.
 */
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

// 首先声明一个需要全局维护的状态 state,比如 我这里举例的resturantName
const state = {
  username: '' // 默认值
}


const getters = {
  username :function (state) {
    return state.username
  }

}

const mutations = {
  loginUsername :function (state,name) {
    state.username = name
  }
}


const actions = {
 loginUserName:function (context,name) {
    return context.commit('loginUsername',name)
  }
}


// 注册上面引入的各大模块
const store = new Vuex.Store({
  state,    // 共同维护的一个状态，state里面可以是很多个全局状态
  getters,  // 获取数据并渲染
  actions,  // 数据的异步操作
  mutations  // 处理数据的唯一途径，state的改变或赋值只能在这里
})


export  default store
