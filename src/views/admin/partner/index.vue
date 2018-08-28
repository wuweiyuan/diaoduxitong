<template>
  <!-- StyleIquiry -->
  <div class="app-container calendar-list-container">
    款名/样板名：
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="" v-model="listQuery.modelname"> </el-input>
    客户/品牌：
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="" v-model="listQuery.brand"> </el-input>
    服装类型：
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="" v-model="listQuery.type"> </el-input>
    创建时间：
    <el-date-picker v-model="value7" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions2">
    </el-date-picker>
    <!-- <el-input @keyup.enter.native="handleFilter" style="width: 600px;" class="filter-item" placeholder="输入公司名、地址关键字或锁号" v-model="listQuery.query"> </el-input> -->
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <div class="filter-container">
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column prop="StyleName" align="center" label="款名"> </el-table-column>
      <!-- <el-table-column prop="model_name" align="center" label="样板名"> </el-table-column>  -->
      <el-table-column align="center" label="样板名">
        <template scope="scope">
                  <a  style="text-decoration:underline; 	color:#20a0ff"   > <router-link  :to="{name:'样板详情',query:{id:scope.row.ModelName}}"  > {{ scope.row.ModelName }}</router-link></a>
</template>
      </el-table-column>  
     <el-table-column prop="Type" align="center" label="服装分类名"> </el-table-column>  
      <el-table-column prop="Brand" align="center" label="客户/品牌"> </el-table-column>    
      <el-table-column prop="SaveModel" align="center" label="存储模式">
<template scope="scope">
  <el-select v-model="scope.row.SaveModel" placeholder="请选择" @change="handleSwitch(scope.row)" :key="scope.row.ModelId">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>
      </el-table-column>    
     <el-table-column prop="Time" :formatter="ChangeDateFormat" align="center" label="创建时间">
        </el-table-column>  
    <el-table-column align="center" label="状态"> 
<template scope="scope">
   {{scope.row.State | StyleIquiryStatus}}
</template>
       </el-table-column>  
      <el-table-column  align="center" label="操作">
<template scope="scope">
  <el-button v-if="scope.row.State==2" type="warning" @click="handleDown(scope.row)">
    下载</el-button>
  <el-button v-if="scope.row.State==1" type="success" @click="handleImport(scope.row)">导入</el-button>
</template>
      </el-table-column>  
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="form.UserName" auto-complete="off"></el-input>
        </el-form-item>

           <el-form-item  v-if="dialogStatus=='create'" label="手机：" :label-width="formLabelWidth">
          <el-input v-model="form.Phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="form.Remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  v-if="dialogStatus=='update'" label="MAC：" :label-width="formLabelWidth">
          <el-input v-model="form.MAC" auto-complete="off"></el-input>
        </el-form-item>
            <el-form-item v-if="dialogStatus=='update'" label="状态：">
           <el-switch
              v-model="form.State"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="启用"
              off-text="禁用"
              :on-value="1"
              :off-value="0">
            </el-switch>
        </el-form-item>
         <el-form-item v-if="dialogStatus=='update'" label="上传权限：">
           <el-switch
              v-model="form.Up"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有"
              off-text="无"
              :on-value="1"
              :off-value="0">
            </el-switch>
        </el-form-item>      
        <el-form-item v-if="dialogStatus=='update'" label="下载权限：">
           <el-switch
              v-model="form.Down"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有"
              off-text="无"            
              :on-value= "1"
              :off-value= "0"
              >
            </el-switch>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    downLoadObj,
    importObj,
    pageSaveModel
  } from "api/admin/findpartner/index";
  import {
    getToken
  } from "utils/auth";
  import {
    mapGetters
  } from "vuex";
  export default {
    name: "user",
    data() {
      return {
        form: {
          UserName: undefined,
          Phone: undefined,
          State: 1,
          Up: undefined,
          Down: 0,
          MAC: undefined,
          Remark: undefined,
          SaveModel: undefined
        },
        defaultDownload: 'http://fwq2012',
        elseDownload: '',
        Download: 'http://mes.etsystem.cn',
        value8: "",
        value7: "",
        value9: "",
        token: getToken(),
        pickerOptions2: {
          shortcuts: [{
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        options: [{
          label: "加法",
          value: 1
        }, {
          label: "普通",
          value: 0
        }, {
          label: "减法",
          value: -1
        }],
        rules: {
          name: [{
              required: true,
              message: "请输入用户",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
          UserName: [{
              required: true,
              message: "请输入账户",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 5,
              max: 20,
              message: "长度在 5 到 20 个字符",
              trigger: "blur"
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          limit: 10,
          page: 1,
          modelname: "",
          brand: "",
          type: "",
          sTime: "",
          eTime: ""
        },
        addPartner: {},
        sexOptions: ["男", "女"],
        dialogFormVisible: false,
        formPhone: "",
        dialogStatus: "",
        userManager_btn_edit: true,
        userManager_btn_del: true,
        userManager_btn_add: true,
        textMap: {
          update: "编辑",
          create: "创建"
        },
        formLabelWidth: "80px",
        tableKey: 0,
        downForm: {
          ModelId: 0
        }
      };
    },
    filters: {
      StyleIquiryStatus: function(val) {
        return val == "0" ?
          "废弃" :
          val == "1" ? "修改中" : val == "2" ? "正常" : "未知";
      },
      SwitchMode: function(val) {
        return val == 0 ? "加法" : val == 1 ? "加法" : val == -1 ? '减法' : '未知';
      }
    },
    created() {
      // const end = new Date();
      // const start = new Date();
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      // this.pickerOptions2.picker.$emit('pick', [start, end]);
      this.getList(this.listQuery);
      console.log(getToken())
      this.userManager_btn_edit = this.elements["userManager:btn_edit"];
      this.userManager_btn_del = this.elements["userManager:btn_del"];
      this.userManager_btn_add = this.elements["userManager:btn_add"];
      // console.log(window.location.href.split('/'))
      // console.log(window.location.href.split('/')[2])
      this.elseDownload = window.location.href.split('/')[2]
      // this.defaultDownload =window.location.href.split('/')[2]
      // console.log(this.elseDownload == 'localhost:9528' || this.elseDownload == 'http://fwq2012')
      // 默认时间：前一个月
      // const start = new Date();
      // var sFullYear = start.getFullYear();
      // var sMonth = start.getMonth();
      // var sData = start.getDate();
      // const end = new Date();
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      // var eFullYear = start.getFullYear();
      // var eMonth = start.getMonth();
      // var eData = start.getDate();
      // this.value7 = [
      //   new Date(eFullYear, eMonth, eData),
      //   new Date(sFullYear, sMonth, sData)
      // ];
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      getList(obj) {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          if (response.status === 200) {
            //成功加载
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
            //成功提示
            //  this.$notify({
            //   message: response.error,
            //   type: "warning",
            //   duration: 2000
            // });
          } else if (response.status === 201) {
            //成功加载
            // this.$notify({
            //   message: "暂无数据",
            //   type: "warning",
            //   duration: 2000
            // });
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          } else {
            //失败提示
            this.$notify({
              offset: 700,
              message: response.error,
              type: "warning",
              duration: 2000
            });
          }
        });
      },
      downLoad(obj) {
        // console.log(obj.row);
        this.downForm.ModelId = obj.row.ModelId;
        this.sownForm.
        downLoadObj(this.downForm).then(res => {
          // console.log(res);
          console.log(res);
        });
      },
      handleImport(row) {
        // console.log(row.ModelId);
        importObj(row.ModelId).then(res => {
          if (res.status == 200) {
            this.$notify({
              message: res.tip,
              type: "success",
              offset: 700,
              duration: 2000
            })
          } else {
            this.$notify({
              message: res.tip,
              type: "error",
              offset: 700,
              duration: 2000
            })
          }
        })
      },
      handleSwitch(row) {
        //改变储存模式
        console.log(row);
        let form = {};
        form.StyleId = row.StyleId;
        form.SaveModel = row.SaveModel;
        pageSaveModel(form).then(res => {
          if (res.status == 200) {
            this.$notify({
              type: "success",
              message: res.tip,
              duration: 2000,
              offset: 700
            })
          } else {
            this.$notify({
              message: res.tip,
              type: "error",
              duration: 2000,
              offset: 700
            })
          }
          this.getList();
        })
      },
      handleDown(row) {
        // console.log("/bmapi/downStyle?ModelId=" + row.ModelId + "&token=" + getToken());
        var form = {};
        form.ModelId = row.ModelId;
        form.token = this.$store.getters.token;
        downLoadObj(form).then(res => {
          if (res.status == 201) {
            this.$notify({
              message: res.tip,
              type: "error",
              offset: 700,
              duration: 2000
            })
          } else {
            window.location.href = "/bmapi/downStyle?ModelId=" + row.ModelId + "&token=" + getToken();
          }
        });
      },
      handleFilter() {
        if (this.value7[0] != null) {
          this.listQuery.sTime =
            new Date(this.value7[0]).toLocaleDateString().replace(/\//g, "-") +
            "-00:00";
          this.listQuery.eTime =
            new Date(this.value7[1]).toLocaleDateString().replace(/\//g, "-") +
            "-23:59";
        } else {
          this.listQuery.sTime = this.listQuery.eTime = "";
        }
        console.log(this.listQuery);
        // console.log(this.listQuery);
        // console.log('listQuery-----------------------------------' + this.listQuery)
        this.getList(this.listQuery);
        // console.log("tag", this.value7[0].toISOString().slice(0, 10));
        // console.log("tag", this.value7[1].toISOString().slice(0, 10));
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      handleEdit(index, row) {
        this.addPartner.Id = row.Id;
        // 添加合作伙伴
        addObj(this.addPartner).then(response => {
          if (response.status === 200) {
            //成功加载
            // var data = response.data;
            // console.log(data)
            //成功提示
            this.$notify({
              offset: 700,
              title: "成功",
              message: "创建成功",
              type: "warning",
              duration: 2000
            });
          } else {
            //失败提示
            this.$notify({
              offset: 700,
              message: response.error,
              type: "warning",
              duration: 2000
            });
          }
        });
        // this.form = this.list[index];
        // this.currentIndex = index;
        // this.dialogFormVisible = true;
        // this.dialogStatus = "update";
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
      },
      handleDelete(row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delObj(row.id).then(() => {
            this.$notify({
              offset: 700,
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                offset: 700,
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                offset: 700,
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      isable(obj) {
        if (obj === 10) {
          return true;
        } else return false;
      },
      resetTemp() {
        this.form = {
          UserName: undefined,
          Phone: undefined,
          State: 1,
          Up: undefined,
          Down: 0,
          MAC: undefined,
          Remark: undefined
        };
      }
    }
  };
</script>
