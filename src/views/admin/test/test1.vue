<template>
  <!-- EmployeeManagement -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column prop="id" width="100px" align="center" label="ID"> </el-table-column>
      <el-table-column prop="name" width="100px" align="center" label="姓名"> </el-table-column>
      <el-table-column prop="password" width="100px" align="center" label="登陆密码"> </el-table-column>
      <el-table-column prop="code" width="110px" align="center" label="工序"> </el-table-column>
      <el-table-column prop="phone" width="200px" align="center" label="手机"> </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
      <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">
        编辑
      </el-button>
      <el-button size="small" type="danger" @click="handleDelete(scope.row)">
        删除
      </el-button>
</template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
  <!-- <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[5,15,20,30,60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div> -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item  label="工号：" :label-width="formLabelWidth"  prop="login_id" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  v-model="form.login_id" auto-complete="off"></el-input>
        </el-form-item>
                <el-form-item  label="姓名：" :label-width="formLabelWidth"  prop="name" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  label="手机：" :label-width="formLabelWidth"  prop="phone" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  label="密码：" :label-width="formLabelWidth"  prop="password" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  label="工序：" :label-width="formLabelWidth"  prop="code" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>
       
     

        <el-form-item  v-if="dialogStatus=='update'" label="姓名" :label-width="formLabelWidth">
          <el-input  style="width:220px"  v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
       
        <el-form-item v-if="dialogStatus=='update'" label="工号" :label-width="formLabelWidth">
          <el-input  style="width:220px"  v-model="form.login_id" auto-complete="off"></el-input>
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
    putObj
  } from "api/admin/user/index1";
  import {
    mapGetters
  } from "vuex";
  // 这里要俺需要引入，我不是一个对象
  import {
    isvalidPhone
  } from 'utils/validate'
  //定义一个全局的变量，谁用谁知道
  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }
  export default {
    name: "user",
    data() {
      return {
        value: 0,
        arr: [],
        state: '0',
        options1: [{
          value: 'A',
          label: '成衣改版',
          children: [{
            value: '11',
            label: '下载样板'
          }, {
            value: '13',
            label: '修改样板'
          }, {
            value: '15',
            label: '放码'
          }, {
            value: '16',
            label: '检查尺寸'
          }, {
            value: '18',
            label: '估算用量'
          }]
        }, {
          value: 'B',
          label: '团订改版',
          children: [{
            value: '22',
            label: '下载样板'
          }, {
            value: '23',
            label: '修改样板'
          }, {
            value: '25',
            label: '放码'
          }, {
            value: '26',
            label: '检查尺寸'
          }, {
            value: '27',
            label: '改驱动规则'
          }]
        }],
        selectedOptions3: [],
        options: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '病假'
        }, {
          value: 2,
          label: '转岗'
        }, {
          value: 3,
          label: '离职'
        }],
        form: {
          state: 0
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
          login_id:[{
            require:true,
            message:"请输入工号",
            trigger:"blur"
          }
          ],
          code:[{
            required:true,
            trigger:"blur"
          }],
          UserName: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            {
              min: 1,
              max: 20,
              message: "长度在 1 到 20 个字符",
              trigger: "blur"
            }
          ],
          Phone: [{
              required: true,
              validator: validPhone,
              message: "请输入手机号",
              trigger: "blur"
            },
            {
              min: 11,
              max: 11,
              message: "长度在11个字符",
              trigger: "blur"
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 15,
          name: undefined
        },
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
        tableKey: 0
      };
    },
    filters: {
      statusFilter(status) {
        const statusMap = ["正常", "病假", "转岗", "离职"]
        return statusMap[status]
      },
      statusFilter1(status) {
        const statusMap = {
          0: "primary",
          1: 'success',
          2: 'warning',
          3: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      handleChange(arg) {
        this.form.code = arg[1];
        this.selectedOptions3 = arg;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response;
          // this.total = response.data.total;
          this.listLoading = false;
        });
      },
      ChangeDateFormat(row, column) {
        var jsondate = row[column.property];
        jsondate = jsondate.replace("/Date(", "").replace(")/", "");
        if (jsondate.indexOf("+") > 0) {
          jsondate = jsondate.substring(0, jsondate.indexOf("+"));
        } else if (jsondate.indexOf("-") > 0) {
          jsondate = jsondate.substring(0, jsondate.indexOf("-"));
        }
        var date = new Date(parseInt(jsondate, 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + minutes + ":" + second;
      },
      change(row) {
        console.log(row)
        putObj(row).then(response => {
          if (response.status === 200) {
            this.dialogFormVisible = false;
            this.$notify({
              offset:700,
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          } else {
            //失败提示
            this.$notify({
              offset:700,
              message: response.error,
              type: "warning",
              duration: 2000
            });
          }
        });
      },
      handleFilter() {
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
        var arr = [];
        this.form = this.list[index];
        this.form = this.list[index];
        console.log(this.form);
        this.currentIndex = index;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
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
          console.log("row:  " + row)
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
            putObj(this.form.id, this.form).then(response => {
              if (response.status === 200) {
                this.dialogFormVisible = false;
                this.$notify({
                  offset:700,
                  title: "成功",
                  message: "更新成功",
                  type: "success",
                  duration: 2000
                });
              } else {
                //失败提示
                this.$notify({
                  offset:700,
                  message: response.error,
                  type: "warning",
                  duration: 2000
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {};
      }
    }
  };
</script>
