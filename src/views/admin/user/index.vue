<template>
  <!-- EmployeeManagement -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" v-if="showAdd">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column prop="Id" width="65" align="center" label="序号"> </el-table-column> -->
      <el-table-column prop="login_id" align="center" label="工号">
        <template scope="scope">
              <a style="color:#20a0ff" href="javascript:"><span @click="handleEdit(scope.$index, scope.row)">{{ scope.row.login_id}}</span></a>
</template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="name" >
<template scope="scope">
  <span v-if="scope.row.name!==' '&&scope.row.name!==null||!showAdd">{{ scope.row.name}}</span>
  <el-button v-else @click="handleDelete(scope.row)">删除</el-button>
</template>
      </el-table-column>
      <el-table-column prop="ProcessName" align="center" label="工序"></el-table-column>
      <el-table-column prop="grouping" align="center" label="分组" :formatter="selectGroup"></el-table-column>
      <el-table-column prop="phone" align="center" label="手机"> </el-table-column>
      <el-table-column prop="last_time" :formatter="ChangeDateFormat" align="center" label="登陆时间"> </el-table-column>
      <el-table-column prop="computer" align="center" label="电脑"> </el-table-column>
      <el-table-column prop="mach_id" align="center" label="设备ID"> </el-table-column>
      <!-- <el-table-column class-name="status-col" label="约束条件" width="100" align="center">
<template scope="scope">
  <el-switch v-model="scope.row.assing" :on-value="1" :off-value="0" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否" @change="change(scope.row)">
  </el-switch>
</template>
      </el-table-column>   -->

      <el-table-column  align="center" label="状态">
<template scope="scope">
  <el-tag :type="scope.row.state | statusFilter1">
    {{scope.row.state | statusFilter}}</el-tag>
</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
<template scope="scope">
  <!-- <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button> -->
  <el-button size="small" type="danger" @click="resetPwd(scope.$index, scope.row)">
    重置密码
  </el-button>
</template>
      </el-table-column>
    </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[5,15,20,30,60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item  label="工号：" :label-width="formLabelWidth"  prop="login_id" v-if="dialogStatus=='create'">
          <el-input  style="width:220px"  type="number" :maxlength=20 :minlength=2 v-model="form.login_id" auto-complete="off"></el-input>
        </el-form-item>
           <el-form-item label="工序：" :label-width="formLabelWidth" prop="process">
        <el-cascader
          :options="options1"
          v-model="selectedOptions3"
          @change="handleChange"
        ></el-cascader>
        </el-form-item>
        <el-form-item  v-if="dialogStatus=='update'" label="设备ID：" :label-width="formLabelWidth">
          <el-input  style="width:220px"  v-model="form.mach_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="状态：" :label-width="formLabelWidth">
<template>
  <el-select v-model="form.state">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>
        </el-form-item>       
        <el-form-item label="分组：" :label-width="formLabelWidth">
<template>
  <el-select v-model="form['grouping']">
    <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>
        </el-form-item>  
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update(form)">确 定</el-button>
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
    selectObj,
    getPersonal,
    showProcess
  } from "api/admin/user/index";
  import {
    getToken,
    setToken,
    getRole,
    setRole,
    setUserId,
    getUserId,
    removeRole,
    removeUserID,
    removeToken
  } from 'utils/auth';
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
        state: 0,
        options1: [{
          value: 'A',
          label: '成衣改版',
          children: []
          // [{
          //   value: 11,
          //   label: '下载样板'
          // }, {
          //   value: 13,
          //   label: '修改样板'
          // }, {
          //   value: 15,
          //   label: '放码'
          // }, {
          //   value: 16,
          //   label: '检查尺寸'
          // }, {
          //   value: 18,
          //   label: '估算用量'
          // }]
        }, {
          value: 'D',
          label: '成衣大货',
          children: []
          // [{
          //   value: 42,
          //   label: '导入订单'
          // }, {
          //   value: 43,
          //   label: '修改纸样'
          // }, {
          //   value: 45,
          //   label: '放码'
          // }, {
          //   value: 46,
          //   label: '检查'
          // }, {
          //   value: 48,
          //   label: '排料'
          // }]
        }],
        options2: [{
          value: 'C',
          label: '团订大货',
          children: [
            //   {
            //   value: '33',
            //   label: '尺码压缩'
            // }, {
            //   value: '34',
            //   label: '尺寸驱动'
            // }, {
            //   value: '35',
            //   label: '特体检查'
            // }, {
            //   value: '37',
            //   label: '裁剪规划'
            // }
          ]
        }, {
          value: 'B',
          label: '团订改版',
          children: [
            //   {
            //   value: '22',
            //   label: '下载样板'
            // }, {
            //   value: '23',
            //   label: '修改样板'
            // }, {
            //   value: '25',
            //   label: '放码'
            // }, {
            //   value: '26',
            //   label: '检查尺寸'
            // }, {
            //   value: '27',
            //   label: '改驱动规则'
            // }
          ]
        }],
        select: 0,
        selectedOptions3: [],
        groups: [{
            value: 1,
            label: "1"
          },
          {
            value: 2,
            label: "2"
          },
          {
            value: 3,
            label: "3"
          },
          {
            value: 4,
            label: "4"
          },
          {
            value: 0,
            label: "不分组"
          },
        ],
        options: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '病假'
        }, {
          value: 3,
          label: '转岗'
        }, {
          value: 5,
          label: '离职'
        }],
        form: {
          state: 0,
          group: 0
        },
        rules: {
          // login_id: [
          //   {
          //     required: true,
          //     message: "请输入工号",
          //     trigger: "blur"
          //   },
          //   {
          //     min: 2,
          //     max: 9,
          //     message: "长度在 2 到 9 个字符",
          //     trigger: "blur"
          //   },
          // ],
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
        user: "",
        total: null,
        listLoading: true,
        showAdd: null,
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
        const statusMap = ["正常", "病假", "", "转岗", "", "离职"]
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
    watch: {
      dialogFormVisible: function(val, oldVal) {
        setTimeout(() => {
          this.getList();
        }, 100);
      },
    },
    created() {
      this.getList();
      this.getPer();
      this.showAdd = (getRole() == "1");
      console.log(this.options1)
      console.log(this.options2)
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      getPer() {
        getPersonal().then(res => {
          this.user = res.data.PLID;
          //将获取到的process添加到数组中
          showProcess(this.user).then(res => {
            var array = res.data.rows;
            // console.log(array);
            var children = [];
            // console.log(array);
            array.forEach(element => {
              if (element.state == 1) {
                if (element.code < 30 && element.code > 20) {
                  var obj = {}
                  obj.value = element.code;
                  obj.label = element.name;
                  this.options2[1].children.push(obj)
                } else if (element.code < 40 && element.code > 30) {
                  var obj = {}
                  obj.value = element.code;
                  obj.label = element.name;
                  this.options2[0].children.push(obj)
                } else if (element.code < 20 && element.code > 10) {
                  var obj = {}
                  obj.value = element.code;
                  obj.label = element.name;
                  this.options1[0].children.push(obj)
                } else if (element.code < 50 && element.code > 40) {
                  var obj = {}
                  obj.value = element.code;
                  obj.label = element.name;
                  this.options1[1].children.push(obj)
                }
              }
            });
            selectObj(this.user).then(res => {
              // console.log(res.tip);
              if (res.tip !== "1") {
                this.options1 = this.options2;
              }
            })
          })
        })
      },
      handleChange(arg) {
        this.form.code = arg[1];
        this.selectedOptions3 = arg;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(err => {
          console.log(err);
          this.listLoading = false;
        });
      },
      // ChangeDateFormat(row, column) {
      //   var jsondate = row[column.property];
      //   jsondate = jsondate.replace("/Date(", "").replace(")/", "");
      //   if (jsondate.indexOf("+") > 0) {
      //     jsondate = jsondate.substring(0, jsondate.indexOf("+"));
      //   } else if (jsondate.indexOf("-") > 0) {
      //     jsondate = jsondate.substring(0, jsondate.indexOf("-"));
      //   }
      //   var date = new Date(parseInt(jsondate, 10));
      //   var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      //   var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      //   var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      //   var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      //   var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      //   return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + minutes + ":" + second;
      // },
      change(row) {
        console.log(row)
        putObj(row).then(response => {
          if (response.status === 200) {
            this.dialogFormVisible = false;
            this.$notify({
              offset: 700,
              title: "成功",
              message: "更新成功",
              type: "success",
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
        selectObj(this.user).then(res => {
          console.log(res.tip);
          if (res.tip !== "1") {
            this.options1 = this.options2;
          }
        })
      },
      handleEdit(index, row) {
        var arr = [];
        this.form = this.list[index];
        // this.form = this.list[index];
        // console.log(this.form.state)
        this.currentIndex = index;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        if (this.form.code <= 20) {
          arr.unshift("A");
          arr.push(this.form.code);
        } else if (this.form.code <= 30) {
          arr.unshift("B");
          arr.push(this.form.code);
        } else if (this.form.code <= 40) {
          arr.unshift("C");
          arr.push(this.form.code);
        } else {
          arr.unshift("D");
          arr.push(this.form.code);
        }
        this.selectedOptions3 = arr;
        // console.log(arr);
      },
      handleUpdate(row) {
       
        getObj(row.id).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
      },
      selectGroup(row) {
        if (row.grouping == 0) {
          return "不分组"
        } else {
          return row.grouping;
        }
      },
      handleDelete(row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delObj(row).then((res) => {
            if (res.status == 200) {
              this.$notify({
                offset: 700,
                type: "success",
                message: res.tip,
              })
          this.getList();
            } else {
              this.$notify({
                offset: 700,
                type: "error",
                message: res.tip,
              })
          this.getList();
            }
          });
        });
        // console.log(row.login_id);
      },
      resetPwd(index, row) {
        this.$confirm("此操作将重置密码, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          row.password = 888888
          putObj(row).then(() => {
            this.$notify({
              offset: 700,
              title: "成功",
              message: "重置成功密码为888888",
              type: "success",
              duration: 2000
            });
          });
        });
      },
      create(formName) {
        const set = this.$refs;
        // set[formName].validate(valid => {
        // if (valid) {
          console.log(this.form.login_id)
        if (this.form.login_id == undefined ) {
          this.$message({
            showClose: true,
            message: '请输入工号',
            type: 'error',
            duration:2000
          });
          // this.dialogFormVisible = false;
          return false
        } else {
          addObj(this.form).then((res) => {
            if (res.status == 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                offset: 700,
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else if (res.status == 201) {
              this.dialogFormVisible = false;
              this.$notify({
                offset: 700,
                title: "失败",
                message: "工号已存在",
                type: "warning",
                duration: 2000
              });
              this.getList();
            }
          });
        }
        // } else {
        //   return false;
        // }
        // });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.getList();
      },
      update(formName) {
        // const set = this.$refs;
        // console.log(formName);
        // this.$refs[formName].resetFields();
        // set[formName].validate(valid => {
        //   if (valid) {
        //     this.dialogFormVisible = false;
        //     this.form.password = undefined;
        putObj(this.form).then(response => {
          if (response.status === 200) {
            this.dialogFormVisible = false;
            this.$notify({
              offset: 700,
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
            this.getList();
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
        // });
      },
      resetTemp() {
        this.form = {};
        this.selectedOptions3 = [];
      }
    }
  };
</script>
