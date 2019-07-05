import Vue from 'vue'
import Router from 'vue-router'
import LoginRegister from '@/pages/LoginRegister'
import GoodsList from '@/pages/GoodsList'
import Cart from '@/pages/Cart'
import Address from '@/pages/Address'
import OrderConfirm from '@/pages/OrderConfirm'
import OrderSuccess from '@/pages/OrderSuccess'
Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList,
      meta:{
        login_require: false
      }
    },
    {
      path: '/LoginRegister',
      name: 'LoginRegister',
      component: LoginRegister,
      meta:{
        login_require: true
      }
    },
    {
      path: '/GoodsList',
      name: 'GoodsList',
      component: GoodsList,
      meta:{
        login_require: false
      }
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart,
      meta:{
        login_require: true
      }
    },
    {
      path: '/Address',
      name: 'Address',
      component: Address,
      meta:{
        login_require: true
      }
    },
    {
      path: '/OrderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm,
      meta:{
        login_require: true
      }
    },
    {
      path: '/OrderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess,
      meta:{
        login_require: true
      }
    }
  ]
})
