<template>
  <div id="app">
    <Navbar/>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar'

export default {
  name: 'App',
  components:{
    Navbar
  }
}
</script>

