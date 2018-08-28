<template>
  <div class="app-container calendar-list-container">
    <el-date-picker v-model="listQuery.Stime" type="date" placeholder="开始日期" value-format="yyyy-MM-dd">
    </el-date-picker>
    -
    <el-date-picker v-model="listQuery.Etime" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
    </el-date-picker>
    </el-date-picker>
    <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item" placeholder="输入文件名,接收方公司名,接收人名" v-model="listQuery.query"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <div class="filter-container">
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column prop="FileName" width="300px" align="center" label="文件名"> </el-table-column> -->
      <el-table-column align="center" label="文件名" width="400">
        <template scope="scope">                      
                  <!-- <a :href="'http://lbwin7/ETDispatchApi/dowonload?pathName=&downloadName=&fId=' +  scope.row.Id  +'&token='+ token  "> -->
                   <a :href="'http://cs.etsystem.cn/ETDispatchApi/dowonload?pathName=&downloadName=&fId=' +  scope.row.Id  +'&token='+ token  ">  

                  {{ scope.row.FileName }}
                  </a>
</template>
    </el-table-column>  
     
        <el-table-column class-name="status-col" label="下载权限" width="120" align="center">
<template scope="scope">
  <el-switch v-model="scope.row.IsValid" :on-value="1" :off-value="0" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用" @change="change(scope.row)">
  </el-switch>
  </el-tooltip>
</template>
      </el-table-column>
      <el-table-column prop="CompanyName" width="300px" align="center" label="接收方"> </el-table-column>      
      <el-table-column prop="DownNum" width="80px" align="center" label="次数"> </el-table-column>
      <!-- <el-table-column prop="FileSize" width="100px" align="center" label="文件大小"> </el-table-column> -->
      <el-table-column prop="Time" width="110px" align="center" label="时间"> </el-table-column>    

       <el-table-column align="center" label="详细" width="80"><template scope="scope">
  <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">
    详情
  </el-button>
</template>

</el-table-column>


  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
   <el-dialog title="文件详情" :visible.sync="dialogFormVisible">

    <el-form size="mini" :model="form" :rules="rules" ref="form" label-width="100px">
      
        <el-form-item label="文件名：" :label-width="formLabelWidth">
          <el-input v-model="form.FileName" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>

          <el-form-item label="上传公司：" :label-width="formLabelWidth">
          <el-input v-model="form.CompanyName" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>


       

        <el-form-item label="上传人：" :label-width="formLabelWidth">
          <el-input v-model="form.Uploader" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>   
         
         <el-form-item label="文件接收人：" :label-width="formLabelWidth">
          <el-input v-model="form.ToUser" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>   

      
        <el-form-item label="文件权限：" :label-width="formLabelWidth">
          <el-input v-model="form.CanOpener" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>


        <el-form-item label="文件大小：" :label-width="formLabelWidth">
          <el-input v-model="form.FileSize" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>  

        <el-form-item label="上传时间：" :label-width="formLabelWidth">
          <el-input v-model="form.Time" auto-complete="off" :readonly="true"></el-input>
        </el-form-item> 

      </el-form>
  </el-dialog>
</div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from "api/admin/FileLog/my";
  import {
    mapGetters
  } from "vuex";
  import {
    details
  } from "api/admin/FileLog/details";
  import {
    getToken
  } from 'utils/auth';
  import Cookies from 'js-cookie'
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
          Remark: undefined
        },
        token: Cookies.get('ETDispatch-Token'),
        detailQuery: {
          Id: null
        },
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
          page: 1,
          limit: 10,
          Stime: "",
          Etime: "", 
          query: ""
        },
        putObj: {
          id: null,
          IsValid: null
        },
        sexOptions: ["男", "女"],
        dialogFormVisible: false,
        formPhone: "",
        dialogStatus: "",
        userManager_btn_edit: true,
        userManager_btn_del: true,
        userManager_btn_add: true,
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
        value6: "",
        value7: "",
        textMap: {
          update: "编辑",
          create: "创建"
        },
        formLabelWidth: "100px",
        tableKey: 0
      };
    },
    created() {
      const end = new Date();
      const start = new Date();
      // end.setTime(end.getTime() );
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      this.listQuery.Etime = end;
      this.listQuery.Stime = start;
      this.getList();
      this.userManager_btn_edit = this.elements["userManager:btn_edit"];
      this.userManager_btn_del = this.elements["userManager:btn_del"];
      this.userManager_btn_add = this.elements["userManager:btn_add"];
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      change(row) {
        if (row.IsValid === 1) {
          this.putObj.IsValid = 0;
        } else {
          this.putObj.IsValid = 1;
        }
        this.putObj.id = row.Id;
        // http://localhost/ETDispatchApi/myupload?obj={
        putObj(this.putObj).then(response => { 
          if (response.status === 200) {
            
            this.$notify({
              offset:700,
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          } else {

            this.$notify({
              offset:700,
              title: "失败",
              message: "更新失败",
              type: "error",
              duration: 2000
            });


          }
        });
      },
      downloadFile(index, row) {
        downloadFile(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      handleFilter() {
        //判断参数  是否有效
        // if (this.listQuery.Etime  > this.listQuery.Etime ){
        // }
        this.getList();
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
        this.detailQuery.Id = row.Id
        details(this.detailQuery).then(response => {
          this.form = response.data.rows;
          this.dialogFormVisible = true;
        });
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
              offset:700,
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
                offset:700,
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
                offset:700,
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

<style rel="stylesheet/scss" lang="scss" scoped>
  a:link {
    color: #20a0ff
  }
  /* 未被访问的链接     蓝色 */
  a:visited {
    color: #20a0ff
  }
  /* 已被访问过的链接   蓝色 */
  a:hover {
    color: #20a0ff
  }
  /* 鼠标悬浮在上的链接 蓝色 */
  a:active {
    color: #20a0ff
  }
  /* 鼠标点中激活链接   蓝色 */
</style>