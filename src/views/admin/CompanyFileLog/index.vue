<template>
<!-- ProcessDebuggingInterface -->
  <div class="app-container calendar-list-container">
    <!-- 模板：
    <el-select v-model="listQuery.QueryType" placeholder="请选择" style="width: 70px;">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select> -->
    流水线：<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="" v-model="listQuery.query"> </el-input>
    工号：<el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="" v-model="listQuery.query"> </el-input>
    款式：<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="" v-model="listQuery.query"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="import" @click="handleFilter">测试</el-button>
    <div class="filter-container">
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
  } from "api/admin/FileLog/needdown";
  import {
    downloadFile
  } from "api/admin/FileLog/downloadFile";
  import {
    details
  } from "api/admin/FileLog/details";
  import {
    mapGetters
  } from "vuex";
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
        IP: process.env.BASE_API,
        options: [{
            value: "0",
            label: "否"
          },
          {
            value: "1",
            label: "是"
          }
        ],
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
          QueryType: "0",
          query: ""
        },
        detailQuery: {
          Id: null
        },
        downloadQuery: {
          fId: null,
          pathName: '',
          downloadName: ''
        },
        sexOptions: ["男", "女"],
        dialogFormVisible: false,
        formPhone: "",
        dialogStatus: "",
        userManager_btn_edit: true,
        userManager_btn_del: true,
        userManager_btn_add: true,
        value6: "",
        value7: "",
        textMap: {
          update: "文件详情",
          create: "创建"
        },
        formLabelWidth: "100px",
        token: Cookies.get('ETDispatch-Token'),
        tableKey: 0
      };
    },
    created() {
      // this.getList();
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
      indexMethod(index) {
        return index * 1;
      },
      //文件大小格式化  去掉小数点后的位  
      dateFormat(row, column) {
        var date = row[column.property];
        return parseInt(date) + date.substr(date.length - 2, date.length);
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
