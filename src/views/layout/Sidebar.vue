<template>
  <el-menu mode="vertical" theme="dark" unique-opened :default-active="$route.path" :collapse="isCollapse">
    
    <sidebar-item :routes='permissionMenus'></sidebar-item>
  </el-menu>
</template>


<script>
  import {
    mapGetters
  } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: {
      SidebarItem
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'permissionMenus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    created(){
      console.log(this.$store.getters.permissionMenus);
    }
  }
</script>

<style>
  .logo{
    margin-top:10px;
    width:130px;
    margin-left:10px;
  }
</style>

