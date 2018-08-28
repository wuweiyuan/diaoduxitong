import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},

{
  path: '/401',
  component: _import('error/401'),
  hidden: false
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: ' 个人信息',
  hidden: true,
  children: [{
    path: 'dashboard',
    // component: _import('dashboard/index')
    // component: _import('admin/test/test1')
    component: _import('admin/test/test')
  }]
},
{
  path: '/',
  component: Layout,
  redirect: '/baseManager/EmployeeManagement',
  name: ' 员工管理',
  hidden: true,
  meta: { role: '1' },
  children: [{
    path: 'EmployeeManagement',
    // component: _import('dashboard/index')
    component: _import('admin/test/test1')
    // component: _import('admin/test/test')
    
  }]
},
{
  path: '/',
  component: Layout,
  redirect: '/baseManager/PipelineManagement',
  name: ' 流水线管理',
  hidden: true,
  meta: { role: '2' },
  children: [{
    path: 'PipelineManagement',
    // component: _import('dashboard/index')
    component: _import('admin/group/index')
    // component: _import('admin/test/test')
    
  }]
},
{
  path: '/introduction',
  component: Layout,
  redirect: '/introduction/index',
  icon: 'form',
  noDropdown: true,
  children: [{
    path: 'index',
    component: _import('introduction/index'),
    name: '简述'
  }]
}
]

export default new Router({
  //  mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  children: [{
    path: 'EmployeeManagement',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '员工管理',
    authority: 'EmployeeManagement'
  },
  {
    path: 'EmployeeManagement1',
    icon: 'fa-user',
    component: _import('admin/test/test'),
    name: '个人信息',
    authority: 'EmployeeManagement1'
  },
  {
    path: 'ProcessModification',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '谁加了我',
    authority: 'ProcessModification'
  }, {
    path: 'PipelineManagement',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '我加了谁',
    authority: 'PipelineManagement'
  },  {
    path: 'StyleIquiry',
    icon: 'group_fill',
    component: _import('admin/partner/index'),
    name: '寻找伙伴',
    authority: 'StyleIquiry'
  }, 
  {
    path: 'staffTypeManager',
    icon: 'fa-user',
    component: _import('admin/staff/index'),
    name: '员工管理',
    authority: 'staffTypeManager'
  }, 
  {
    path: 'SampleDetails',
    icon: 'fa-user',
    component: _import('admin/customerinform/index'),
    name: '样板详情',
    authority: 'SampleDetails'
  }, 
  {
    path: 'orderSearch',
    icon: 'fa-user',
    component: _import('admin/orderSearch/orderSearch'),
    name: '生产单查询',
    authority: 'orderSearch'
  }, 

  {
    path: 'synthesize',
    icon: 'fa-user',
    component: _import('admin/synthesize/synthesize'),
    name: '系统维护',
    authority: 'synthesize'
  }, 
  {
    path: 'orderDetail',
    icon: 'fa-user',
    component: _import('admin/orderSearch/orderDetail'),
    name: '生产单查询',
    authority: 'orderDetail'
  }, 
  
  {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }, 
   {
    path: 'uploadFile',
    icon: 'viewlist',
    component: _import('admin/upload/uploadFile'),
    name: '我要上传',
    authority: 'uploadFile'
  },
  {
    path: 'PastYearStatistics',
    icon: 'viewlist',
    component: _import('admin/charts/uploadlog'),
    name: '往年统计',
    authority: 'PastYearStatistics'
  },
  {
    path: 'PieceworkStatistics',
    icon: 'viewlist',
    component: _import('admin/charts/line'),
    name: '计件统计',
    authority: 'PieceworkStatistics'
  },
  {
    path: 'PieceworkStatistics1',
    icon: 'viewlist',
    component: _import('admin/charts/line1'),
    name: '样板统计',
    authority: 'PieceworkStatistics1'
  },

  {
    path: 'ProcessDebuggingInterface',
    icon: 'viewlist',
    component: _import('admin/CompanyFileLog/index'),
    name: '流程调试界面',
    authority: 'ProcessDebuggingInterface'
  },
  {
    path: 'DataImport',
    icon: 'viewlist',
    component: _import('admin/CompanyFileLog/needLoad'),
    name: '需要下载',
    authority: 'DataImport'
  },
  {
    path: 'CurrentYearStatistics',
    icon: 'viewlist',
    component: _import('admin/charts/CurrentYearStatistics'),
    name: '当年统计',
    authority: 'CurrentYearStatistics'
  },
  {
    path: 'viewLog',
    icon: 'viewlist',
    component: _import('admin/viewLog/viewLog'),
    name: '查看日志',
    authority: 'viewLog'
  },
  {
    path: 'FlowNumber',
    icon: 'viewlist',
    component: _import('admin/FlowNumber/index'),
    name: '流水号查询',
    authority: 'FlowNumber'
  }
  // {
  //   path: '/example/table',
  //   component: Layout,
  //   redirect: 'example/table',
  //   icon: 'excel',
  //   noDropdown: true,   
  //   hidden: false ,
  //   meta : { role: ['admin'] } ,
  //   children: [{ path: 'staffManagement', component: _import('example/table/staffManagement'), name:'员工管理', meta: { role: ['admin'] } }]
  // },

]  
}];
