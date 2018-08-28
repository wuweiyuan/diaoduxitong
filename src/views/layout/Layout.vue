<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main class="app-main"></app-main>
				<div class="footer">
      <!--页脚-->
			
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from 'views/layout';

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;
		&.hideSidebar {
			.sidebar-container{
				width:36px;
				overflow: inherit;
			}
			.main-container {
				margin-left: 36px;
			}
		}
		.sidebar-container {
			transition: width 0.28s ease-out;
			width: 10%;
			min-width:100px;
			height: 100%;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			z-index: 1001;
			overflow-y: auto;
 			&::-webkit-scrollbar {display:none}
		}
		.main-container {
			// min-height: 100%;
			transition: margin-left 0.28s ease-out;
			margin-left: 10%;
			width:90%;
			min-width:900px;
		}
		.app-main{
			// height:800px;
			height:850px;
			// border:1px solid red;
		}
		.footer {
			// border: 1px red solid;
			// position: absolute;
			height: 50px;
			width: 600px;
			margin:0 auto;
			/* background-color: #FFFFFF; */
			line-height: 50px;
			text-align: center;
			/* box-sizing: border-box; */
			/* border-top: 1px solid #CCCCCC; */
			// bottom:0px;
		}

	}
</style>
