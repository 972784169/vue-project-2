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
      component: GoodsList
    },
    {
      path: '/LoginRegister',
      name: 'LoginRegister',
      component: LoginRegister
    },
    {
      path: '/GoodsList',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/Address',
      name: 'Address',
      component: Address
    },
    {
      path: '/OrderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/OrderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
