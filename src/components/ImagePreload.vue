<template lang="html">
  <div id="image">

  </div>
</template>

<script>
export default {
  props: ["url"],
  data(){
    return{

    }
  },
  created(){
    let img = new Image();
    img.src = this.url;
  }
}
</script>

<style lang="css" scoped>
</style>
