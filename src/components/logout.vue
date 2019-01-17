<template lang="html">

</template>

<script>
import { auth } from "../config/firebase_config.js"
export default {
  data(){
    return{

    }
  },
  mounted(){
    this.signOut();
  },
  methods: {
    signOut: function(){
      auth.signOut().then(() => {
        this.$parent.projectKey = "";
      })
    }
  }
}
</script>

<style lang="css">
</style>
