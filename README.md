# ET调度系统  cjf

# 版本说明

# ET调度系统 
[![BM_ETDispatch](https://img.shields.io/hexpm/l/plug.svg)](http://www.etsystem.cn/)
[![BM_ETDispatch](https://img.shields.io/badge/release-v0.0.1-blue.svg)](http://www.etsystem.cn/)
[![BM_ETDispatch](https://img.shields.io/wercker/ci/wercker/docs.svg)](http://www.etsystem.cn/)
[![BM_ETDispatch](https://img.shields.io/badge/BM_ETDispatch-v0.0.1-brightgreen.svg)](http://www.etsystem.cn/)

element使用1.4版本

## 准备工作
- node.js环境（npm包管理器）
- vue-cli 脚手架构建工具
- cnpm  npm的淘宝镜像
## vscode 插件
- wpy-beautify   vue代码格式化插件
- vscode ctrl+p  根据文件名快速搜索文件

## 开发运行
```bash
   
    # 安装依赖
    npm install
    //or # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install --registry=https://registry.npm.taobao.org

    # 本地开发 开启服务
    npm run dev

    # 安装json-server
    npm install json-server -g 

    # 开启模拟数据
    npm run data
    npm run menu
    -  or
    json-server --watch data.json --port 9090 
    json-server --watch menu.json --port 9091
    json-server --watch dbtest.json --port 9092

    #对接测试接口
    http://lbwin7/Help
    #员工管理接口
    http://lbwin7/StaffManage

```
浏览器访问 http://localhost:9527



#测试地址   
http://fwq2012
#   角色      账户    密码
 普通员工   putong    888888
 主管       test      888888  
 管理员     admin     888888


#修改代理路径   config/index.js


## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build:prod
```
## 待解决问题
```
1 更换图标 
2 在普通员工的个人信息里面加入所在流水线名称
3 在主管身份的添加员工下面不能不填写工号的情况下创建成功
4 将登陆信息和密码保存在cookie里面

    
    
```
##menu分级
menu0 普通员工
menu1 主管
menu2 管理员




## 中英词汇对照  采用百度翻译
```
流水线:AssemblyLine
工序:process 
款式:style
设备:device
样板:Model
生产单:order
样板:Model
物料编码:MaterialCode
料率:FeedRate

-- 页面
员工管理:EmployeeManagement
样板详情:SampleDetails
数据导入:DataImport
流程调试界面:ProcessDebuggingInterface
流水线管理:PipelineManagement
工序修改:ProcessModification
款式查询:StyleIquiry
往年统计：PastYearStatistics
计件统计：PieceworkStatistics
当年统计：CurrentYearStatistics







 

##修改页面路径步骤：（为了方便查找）

1 router/index.js里面查找修改
2 menu.json里面查找修改
3 在vue中增加注释
4 接口中增加注释
5 在搜索栏中测试



设置默认时间：前一个月
        var sFullYear = start.getFullYear();
        var sMonth = start.getMonth();
        var sData = start.getDate(); 
        const end = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        var eFullYear = start.getFullYear();
        var eMonth = start.getMonth();
        var eData = start.getDate(); 
        this.value7 = [new Date(eFullYear,eMonth,eData),new Date(sFullYear,sMonth,sData)];

    
```


## 添加菜单步骤   
```
1、menu.json  控制菜单显示
{
          "id": 9,
          "parentId": 5,
          "children": [],
          "icon": "group_fill",
          "title": "生产单查询",
          "href": "/admin/orderSearch",
          "spread": false,
          "path": "/adminSys/baseManager/orderSearch",
          "code": "orderSearch"
}

  
2、info.json  
 {
        "code": "orderSearch",
        "type": "menu",
        "uri": "/admin/orderSearch",
        "method": "GET",
        "name": "访问",
        "menu": "生产单查询"
 },

3、all.json
 {
    "id": 9,
    "code": "orderSearch",
    "title": "生产单查询",
    "parentId": 5,
    "href": "/admin/orderSearch",
    "icon": "group_fill",
    "type": "menu",  
    "attr1": "import('admin/orderSearch/index')",
    "path": "/adminSys/baseManager/orderSearch"
  },

  4、前端  route/index.js  要增加相应的路径
  {
    path: 'orderSearch',
    icon: 'fa-user',
    component: _import('admin/orderSearch/index'),
    name: '生产单查询',
    authority: 'orderSearch'
  }, 
    
```

### 部署nginx配置参考
```
  location / {
        # 指向我们打包后上传的前端文件
        root /opt/nginx/dist;
        index index.html;
    }
    location /jwt/ {
        # 转发请求到后端服务网关
        proxy_pass http://127.0.0.1:8765/jwt/;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8765/api/;
     }
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。



