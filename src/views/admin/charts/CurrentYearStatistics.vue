<template>
  <div class="components-container" style='height:100vh'>
    <div class='chart-container'>
      <currentYearchart height='100%' width='100%'></currentYearchart>
    </div>
  </div>
</template>

<script>
import currentYearchart from '@/components/Charts/currentYearchart'

export default {
  components: { currentYearchart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 90%;
  padding-bottom: 40px;
}
</style>

