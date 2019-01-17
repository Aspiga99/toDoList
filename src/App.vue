<template>
  <div id="appInd">
    <app-header v-bind:id="id"></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import header from "./components/Header.vue"

export default {
  components: {
    "app-header": header
  },
  data () {
    return {
      pKey: "",
      id: 0
    }
  },
  updated(){
    this.$root.$emit("updateValue");
  }
}
</script>

<style>
body{
  background-color: #f0f0f0;;
}

</style>
