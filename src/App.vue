<template>
  <div id="app">
    <my-header></my-header>
    <router-view/>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import Header from "./components/Header"
  import Footer from "./components/Footer"
export default {
  components:{
    myHeader:Header,
    myFooter:Footer
  },
  name: 'App'
}
</script>

<style>
#app {

}
</style>
