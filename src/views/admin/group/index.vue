<template>
  <!-- PipelineManagement -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" v-if="showAdd">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="流水线">
        <template scope="scope">
              <el-button size="small" type="text" @click="handleName(scope.$index, scope.row)">
                {{ scope.row.name }}
              </el-button>
</template>
      </el-table-column>

      <el-table-column prop="type" align="center" label="类型" :formatter="typeStyle"> </el-table-column>

      <el-table-column prop="UserName" align="center" label="主管"> 
<template scope="scope">
  <el-button size="small" type="text" @click="handleUpdate(scope.row)" v-if="showAdd">
    {{ scope.row.UserName | isName }}
  </el-button>
  {{showAdd?"":scope.row.UserName}}
</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
<template scope="scope">
  <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">
    编辑
  </el-button>
</template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if="dialogif=='updatePL'">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

        <el-form-item label="流水线：" :label-width="formLabelWidth" prop="name">
          <el-input style="width:220px" v-model="form.name" auto-complete="off" :disabled="dialogStatus!=='create'"></el-input>
        </el-form-item>
        <el-form-item label="类型：" :label-width="formLabelWidth" prop="type">
            <el-select v-model="form['type']" placeholder="请选择" :disabled="dialogStatus!=='create'">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主管工号：" :label-width="formLabelWidth" prop="name">
          <el-input style="width:220px" v-model="form.login_id" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogtitleProcess" :visible.sync="dialogFormVisible" v-if="dialogif=='updateProcess'" width="100%">
      <el-table :key='tableKey' :data="list1" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="name" align="center" label="工序名称"> </el-table-column>
        <el-table-column class-name="status-col" label="是否跳过" width="100px" align="center">
<template scope="scope">
  <el-switch v-model="scope.row.state" :on-value=0 :off-value=1 off-color="#ff4949" on-color="#13ce66" on-text="是" off-text="否" v-if="scope.row.assign==1" @change="setChange(scope.$index,scope.row)" :disabled="scope.row.state==1&&isDisabled">
  </el-switch>
</template>
        </el-table-column>
        <el-table-column label="权重" align="center" width='150'>
<template scope="scope">
  <el-select v-model="scope.row.weight" placeholder="权重" @change="weightChange(scope.row)" :disabled="scope.row.state==0">
    <el-option label=0.5 value=0.5></el-option>
    <el-option label=1.0 value=1.0></el-option>
    <el-option label=1.5 value=1.5></el-option>
    <el-option label=2.0 value=2.0></el-option>
  </el-select>
</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    
    <el-dialog :title="dialogtitleProcess" :visible.sync="dialogFormVisible" v-if="dialogif=='updateName'" width="100%">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="流水线：" :label-width="formLabelWidth" prop="name">
          <el-input style="width:220px" v-model="form.name" auto-complete="off" :disabled="dialogStatus!=='create'"></el-input>
        </el-form-item>
        <el-form-item label="新流水线名称" :label-width="formLabelWidth">
          <el-input style="width:220px" v-model="newName" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button> -->
        <el-button type="primary" @click="updatePLName()">确 定</el-button>
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
    setObj,
    weightObj,
    updateName
  } from "api/admin/user/device";
  import {
    mapGetters
  } from "vuex";
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
  //这里要俺需要引入，我不是一个对象
  import {
    isvalidPhone
  } from "utils/validate";
  //定义一个全局的变量，谁用谁知道
  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error("请输入电话号码"));
    } else if (!isvalidPhone(value)) {
      callback(new Error("请输入正确的11位手机号码"));
    } else {
      callback();
    }
  };
  export default {
    name: "user",
    data() {
      return {
        isDisabled: false,
        showAdd: false,
        value: 0,
        dialogif: null,
        dialogtitleProcess: "修改流水线",
        options1: [{
            value: "A",
            label: "成衣改版",
            children: [{
                value: "11",
                label: "下载样板"
              },
              {
                value: "13",
                label: "修改样板"
              },
              {
                value: "15",
                label: "放码"
              },
              {
                value: "16",
                label: "检查尺寸"
              },
              {
                value: "18",
                label: "估算用量"
              }
            ]
          },
          {
            value: "B",
            label: "团订改版",
            children: [{
                value: "22",
                label: "下载样板"
              },
              {
                value: "23",
                label: "修改样板"
              },
              {
                value: "25",
                label: "放码"
              },
              {
                value: "26",
                label: "检查尺寸"
              },
              {
                value: "27",
                label: "改驱动规则"
              }
            ]
          }
        ],
        selectedOptions3: ["A", "11"],
        options: [{
            value: 0,
            label: "团订"
          },
          {
            value: 1,
            label: "成衣"
          }
        ],
        form: {
          UserName: undefined,
          Phone: undefined,
          State: 1,
          Up: undefined,
          Down: 0,
          MAC: undefined,
          Remark: "",
          type: "",
          weight: 0
        },
        newName:"",
        setForm: {
          delCode: 0,
          setCode: 0,
          name: "",
          id: 0
        },
        rules: {
          name: [{
              required: true,
              message: "请输入",
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
        list1: [],
        arr: [],
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
        formLabelWidth: "100px",
        tableKey: 0
      };
    },
    created() {
      this.getList();
      this.userManager_btn_edit = this.elements["userManager:btn_edit"];
      this.userManager_btn_del = this.elements["userManager:btn_del"];
      this.userManager_btn_add = this.elements["userManager:btn_add"];
      this.showAdd = (getRole() == "2");
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      tableRowClassName(row) {
        if (row.code < 30) {
          return "warning-row";
        }
      },
      typeStyle(row) {
        if (row.type == 1) {
          return "成衣"
        } else {
          return "团订"
        }
      },
      setChange(index, row) {
        let arr = [];
        let maxCode = 0;
        // 改变后的值
        if (row.state == 1) {
          row.state = 0;
        } else {
          row.state = 1;
        }
        this.list1.forEach(element => {
          if (element.assign == 1 && element.state == 1) { //获取可选跳过且未跳过的开关个数
            arr.push(1);
            maxCode = element.code;
          }
        });
        //判断最后一个开关是否禁用
        if (arr.length <= 1) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
        //发送请求
        if (row.state == 0) { //跳过时执行的函数
          this.resetForm();
          this.setForm.delcode = row.code;
          this.setForm.setcode = maxCode;
          this.setForm.name = "";
          this.setForm.id = row.PLID;
          this.update(this.setForm);
        } else { //不跳过时执行的函数
          //重置表单
          this.resetForm();
          this.setForm.delcode = 0;
          this.setForm.setcode = row.code;
          this.setForm.name = row.name;
          this.setForm.id = row.PLID;
          this.update(this.setForm);
        }
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      weightChange(row) {
        console.log(row);
        weightObj(row).then(res => {
          if (res.status == 200) {
            this.$notify({
              message: res.tip,
              type: "success",
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
        })
      },
      change(row) {
        putObj(row).then(response => {
          if (response.status === 200) {
            this.dialogFormVisible = false;
            this.$notify({
              offset: 700,
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
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
        this.dialogif = "updatePL";
        this.dialogFormVisible = true;
      },
      handleName(index, row) {
        //更改流水线名字
        this.form = row;
        console.log(row);
        this.dialogif = 'updateName';
        this.dialogFormVisible = true;
        this.dialogtitleProcess = '修改流水线名称';
      },
      updatePLName(){
        var form = {};
        form.PLID = this.form.id;
        form.PLName = this.newName;
        updateName(form).then(res=>{
          if(res.status==200){
            this.$notify({
              type:"success",
              message:res.tip,
              title:"成功",
              duration:2000
            })
        this.getList();
          }else{
            this.$notify({
              type:"error",
              message:res.tip,
              title:"失败",
              duration:2000
            })
        this.getList();
          }
          this.dialogFormVisible = false;
        }).catch(err=>{
          this.dialogFormVisible = false;
          // console.log(err);
        })
        this.getList();
      },
      handleEdit(index, row) {
        this.isDisabled = false;
        this.dialogtitleProcess = "修改 " + row.name + " 流水线的工序";
        this.form = this.list[index];
        this.currentIndex = index;
        this.dialogFormVisible = true;
        this.dialogif = "updateProcess";
        getObj(row.id).then(res => {
          if (res.status == 200) {
            this.list1 = res.data.rows;
            let arr = [];
            this.list1.forEach(element => {
              if (element.assign == 1 && element.state == 1) {
                arr.push(1);
              }
            });
            if (arr.length == 1) {
              this.isDisabled = true;
            }
          }
        });
      },
      handleUpdate(row) {
        this.resetTemp();
        this.dialogStatus = "update";
        this.dialogif = "updatePL";
        this.dialogFormVisible = true;
        this.form = row;
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
        this.newName = "";
        this.form = {};
      },
      update(formName) {
        putObj(formName).then(res => {
          if (res.status == 200) {
            this.$notify({
              offset: 700,
              type: "success",
              message: "成功",
              duration: 2000
            })
          } else {
            this.$notify({
              offset: 700,
              type: "error",
              message: "失败",
              duration: 2000
            })
          }
        })
      },
      updateForm() {
        var form = {};
        form.loginid = this.form.login_id
        form.plid = this.form.id;
        setObj(form).then(res => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              offset: 700,
              type: "success",
              message: "更新成功"
            })
          } else {
            this.$notify({
              title: "失败",
              offset: 700,
              type: "error",
              message: res.tip
            })
          }
          this.getList();
        })
        this.dialogFormVisible = false;
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
      },
      resetForm() {
        this.setForm = {
          delCode: 0,
          setCode: 0,
          name: "",
          id: 0
        }
      }
    },
    filters: {
      isName: function(name) {
        if (name == null) {
          return "未定义"
        } else {
          return name;
        }
      }
    }
  };
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
