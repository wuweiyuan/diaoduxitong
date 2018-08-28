<template>
	<div class='menu-wrapper'>
		<template v-for="item in routes">
	      <el-submenu v-if="item.children.length>1" :default-openeds="['1']" :index="item.title" :key="item.title">
	<template slot="title">
	  <i :class='item.icon1' v-if="item.icon1" style="marginRight:16px"></i>
	  <icon-svg :icon-class="item.icon"></icon-svg>
	  <span>{{item.title}}</span>
</template>

<template v-for="child in item.children">
	<sidebar-item :default-openeds="['1']" class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
	<router-link v-else :to="'/'+item.code+'/'+child.code">
		<el-menu-item :default-openeds="['1']" :index="item.code+'/'+child.code">
			<icon-svg :icon-class="child.icon"></icon-svg>
			<span>{{child.title}}</span>
		</el-menu-item>
	</router-link>
</template>
		</el-submenu>
		<el-item v-else :default-openeds="['1']" :index="item.title">
<template slot="title">
	<icon-svg v-if='item.icon' :icon-class="item.icon">
	</icon-svg>
	<span>{{item.title}}</span>
</template>
<template v-for="child in item.children">
	<sidebar-item :default-openeds="['1']" class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
	<router-link v-else :to="'/'+item.code+'/'+child.code">
		<el-menu-item :default-openeds="['1']" :index="item.code+'/'+child.code">
			<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
			<span>{{child.title}}</span>
		</el-menu-item>
	</router-link>
</template>
		</el-item>

	</template>

	</div>
</template>

<script>
	export default {
		name: "SidebarItem",
		props: {
			routes: {
				type: Array
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

