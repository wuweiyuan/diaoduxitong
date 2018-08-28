<template>
  <!-- DataImport -->
  <div class="app-container calendar-list-container">
    模板：
    <el-select v-model="downloadQuery['model']" placeholder="请选择" style="width: 70px;">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    存储模式：
    <el-select v-model="downloadQuery['SaveModel']" placeholder="请选择" style="width: 90px;">
      <el-option v-for="item in SaveModeloptions" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    服装类名：
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="" v-model="downloadQuery['type']"> </el-input>
    品牌：
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="" v-model="downloadQuery['brand']"> </el-input>
    性别：
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="" v-model="downloadQuery['sex']"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="import" @click="handleFilter">导入</el-button>
    <div class="filter-container">
    </div>
    <el-dialog title="文件详情" :visible.sync="dialogFormVisible">
      <el-form size="mini" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="文件名：" :label-width="formLabelWidth">
          <el-input v-model="form['FileName']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="上传公司：" :label-width="formLabelWidth">
          <el-input v-model="form['CompanyName']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="上传人：" :label-width="formLabelWidth">
          <el-input v-model="form['Uploader']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="文件接收人：" :label-width="formLabelWidth">
          <el-input v-model="form['ToUser']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="文件权限：" :label-width="formLabelWidth">
          <el-input v-model="form['CanOpener']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="文件大小：" :label-width="formLabelWidth">
          <el-input v-model="form['FileSize']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="上传时间：" :label-width="formLabelWidth">
          <el-input v-model="form['Time']" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  
<el-upload
  class="upload-demo"
  ref="upload"
  action="http://lbwin7/bmapi/api/values" 
  :on-preview="handlePreview"
  :data="updata"
  :on-remove="handleRemove"
  :on-success="successUpload"
  :file-list="fileList"
  :multiple="true"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
</el-upload>

  <!-- 原生文件请求 -->
    <!-- <form id="myform" enctype="multipart/form-data">
      <input type="file" name="fileup" id="fileup" v-on:change="fileChange($event)" />
    </form> -->
     <!-- 原生文件请求 -->
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
            value: 0,
            label: "否"
          },
          {
            value: 1,
            label: "是"
          }
        ],
        SaveModeloptions: [{
            value: 0,
            label: "普通"
          },
          {
            value: 1,
            label: "加法"
          },
          {
            value: -1,
            label: "减法"
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
          SaveModel: "0",
          query: ""
        },
        detailQuery: {
          Id: null
        },
        downloadQuery: {
          model: 0,
          type: '',
          brand: '',
          SaveModel: 0,
          sex: ""
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
        tableKey: 0,
        fileList: [],
        updata: {
          fileup: '1111'
        }
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
      // vue文件上传测试
    // 上传函数
      submitUpload() {
      this.$refs.upload.submit();
      },
      // 移除文件函数
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 点击预览
      handlePreview(file) {
        console.log(file);
      },
      // 上传成功函数
      successUpload(response, file, ) {
        console.log(response)
        // console.log(file)
      },
  // 原生文件请求
      // fileChange: function(el) {
      //   console.log(el)
      //   if (!el.target.files[0].size) return;
      //   var obj = new FormData(document.getElementById("myform"));
      //   console.log(obj)
      //   // obj.append("name", "wzh");
      //   var _this = this;
      //   $.ajax({
      //     type: 'post',
      //     url: 'http://lbwin7/bmapi/api/values',
      //     data: obj,
      //     cache: false,
      //     processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
      //     contentType: false, // 不设置Content-type请求头
      //     success: function(res) {
      //       console.log(res)
      //     },
      //   });
      // },
      // 原生文件请求结束
      // 文件上传测试
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
        console.log(this.downloadQuery)
        addObj(this.downloadQuery).then(res => {
          if (res.status === 200) {
            this.$notify({
              offset: 700,
              title: "成功",
              message: res.tip,
              type: "success",
              duration: 2000
            });
            this.resetTemp();
          } else {
            //失败提示
            this.$notify({
              offset: 700,
              message: res.tip,
              type: "warning",
              duration: 2000
            });
            this.resetTemp()
          }
        })
        // this.getList();
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
        this.downloadQuery = {
          model: 0,
          type: '',
          brand: '',
          SaveModel: 0,
          sex: ""
        }
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
