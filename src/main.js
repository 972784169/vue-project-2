// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import  store from './store/store'
import VueLazyload from 'vue-lazyload'
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.use(VueLazyload, {
  loading: '../static/loading-svg/loading-bubbles.svg',

})
Vue.config.productionTip = false
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'
import './assets/css/styles.css'
import './assets/js/jquery-3.1.1.min.js'
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to,from,next)=>{
  let userid=localStorage.getItem("userid");
  if(to.matched.some((item)=>{item.meta.login_require;}))
  {
    console.log(to.matched);

    if(userid)
    {
      next();
    }
    else if(to.path=="/LoginRegister")
    {
      next();
    }
    else if(to.path=="/Cart")
    {
      next({path:"/Cart"});
    }
  }
  else
  {
    next();
  }
})
