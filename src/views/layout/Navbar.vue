<template>
  <el-menu class="navbar" mode="horizontal" background-color="#eef1f6">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <levelbar></levelbar>
    <tabs-view></tabs-view>
    <!-- <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log> -->
    <screenfull class='screenfull' style="margin:0 40px"></screenfull>
    <el-dropdown class="avatar-container" trigger="click" style="marginRight:30px">
      <div class="avatar-wrapper"> <img class="user-avatar" src="./11111.jpg">
        <i class="el-icon-arrow-down"></i>
      </div>
      <el-dropdown-menu :default-openeds="['0']" class="user-dropdown" slot="dropdown">
        <router-link :default-openeds="['0']" class='inlineBlock' to="/">
          <el-dropdown-item> 个人信息 </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <MsgRemind class="msgRemind"></MsgRemind>
  </el-menu>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  import Levelbar from './Levelbar';
  import TabsView from './TabsView';
  import Hamburger from 'components/Hamburger';
  import Screenfull from 'components/Screenfull';
  import ErrorLog from 'components/ErrLog';
  import MsgRemind from 'components/MsgRemind';
  import errLogStore from 'store/errLog';
  export default {
    components: {
      Levelbar,
      TabsView,
      Hamburger,
      ErrorLog,
      Screenfull,
      MsgRemind
    },
    data() {
      return {
        log: errLogStore.state.errLog

      }
    },
    computed: { ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut')
          .then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    // border:1px solid red;
    // display:flex;
    // justify-content: space-between;
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    min-width: 800px;
    .errLog-container {
      display: inline-block;
      position: absolute;
      right: 150px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px ;
      color: red;
    }
    .msgRemind {
      width: 44px;
      height: 28px;
      display: inline-block;
      float: right;
      margin-right: 10px;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      bottom: 8px; // float:right;
      // border:1px solid red;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 15px;
        position: relative;
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
