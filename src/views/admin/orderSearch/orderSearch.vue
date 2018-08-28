<template>
  <div style="min-width:1300px;" class="app-container calendar-list-container">
    <!-- orderSearch -->
    样板名：
    <el-input @keyup.enter.native="handleFilter" style="width: 5%;" class="filter-item" placeholder="" v-model="form.ModelName"> </el-input>
    客户/品牌：
    <el-input @keyup.enter.native="handleFilter" style="width: 5%;" class="filter-item" placeholder="" v-model="form.ErpName"> </el-input>
    生产单号：
    <el-input @keyup.enter.native="handleFilter" style="width: 5%;" class="filter-item" placeholder="" v-model="form.OrderId"> </el-input>
    产量：
    <el-input @keyup.enter.native="handleFilter" style="width: 5%;" class="filter-item" placeholder="" v-model="form.Yield"> </el-input>
    状态:
    <el-select v-model="form.State" placeholder="请选择" style="width: 8%;">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    创建时间：
    <el-select v-model="form.sTime" placeholder="请选择" style="width: 8%;">
      <el-option v-for="item in optiontimes" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <!-- <el-date-picker v-model="value7" style="width: 15%;" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions2">
      </el-date-picker> -->
    绑定：
    <!-- <el-select v-model="form['IsBind']" placeholder="请选择" style="width: 8%;">
          <el-option v-for="item in isBinding" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
    <el-switch on-value=1 off-value=0 on-text="绑定" off-text="任意" v-model="form['IsBind']" @change="handleFilter"></el-switch>
    <!-- <el-input @keyup.enter.native="handleFilter" style="width: 600px;" class="filter-item" placeholder="输入公司名、地址关键字或锁号" v-model="listQuery.query"> </el-input> -->
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" type="primary" v-waves icon="check" @click="handleBind" style="float:right" v-if="selectState==='unSelect'">绑定</el-button>
    <el-button class="filter-item" type="primary" v-waves icon="check" @click="handleUnBind" style="float:right" v-if="selectState==='selected'">解绑</el-button>
    <div class="filter-container">
    </div>
    <el-table :key='tableKey' ref="multipleTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :row-class-name="selectColor">
      <!-- <el-table-column prop="model_name" width="100px" align="center" label="样板名"> </el-table-column>  -->
      <el-table-column type="selection" width="55" :selectable="isSelect"></el-table-column>
      <el-table-column prop="BindId" align="center" label="绑定号" :formatter="isBind"></el-table-column>
      <el-table-column align="center" highlight-current-row=true label="生产单号">
        <template scope="scope">
              <!-- <a style="text-decoration:underline;"  > <router-link to="/baseManager/orderDetail"> {{ scope.row.OrderId }}</router-link></a> -->
              <a  style="text-decoration:underline; 	color:#20a0ff"   > <router-link  :to="{name:'生产单详情',query:{id:scope.row.Id,mode:'process'}}"  > {{ scope.row.OrderId }}</router-link></a>
</template>
      </el-table-column>  
     <el-table-column prop="ModelName"  align="center" label="样板名"> </el-table-column>    
      <el-table-column prop="ErpName"  align="center" label="客户/品牌"> </el-table-column>    
      <el-table-column prop="Yield" width="100px" align="center" label="产量">
        <template scope="scope">
          <a style="text-decoration:underline; 	color:#20a0ff">
            <router-link :to="{name:'生产单详情',query:{id:scope.row.Id,mode:'Yield',type:scope.row.type}}"> {{ scope.row.Yield }}</router-link>
          </a>
        </template> 
      </el-table-column>    
      <el-table-column prop="mcode" width="100px" align="center" label="物料名"> </el-table-column>    
      <el-table-column prop="Pod" width="100px" align="center" label="特体数">
<template scope="scope">
  <!-- <a style="text-decoration:underline;"  > <router-link to="/baseManager/orderDetail"> {{ scope.row.OrderId }}</router-link></a> -->
  <a style="text-decoration:underline; 	color:#20a0ff">
    <router-link :to="{name:'生产单详情',query:{id:scope.row.Id,mode:'pod'}}"> {{ scope.row.Pod }}</router-link>
  </a>
</template>
        </el-table-column> 
      <el-table-column prop="Bed" width="100px" align="center" label="床数">
<template scope="scope">
  <!-- <a style="text-decoration:underline;"  > <router-link to="/baseManager/orderDetail"> {{ scope.row.OrderId }}</router-link></a> -->
  <a style="text-decoration:underline; 	color:#20a0ff">
    <router-link :to="{name:'生产单详情',query:{id:scope.row.Id,mode:'bed'}}"> {{ scope.row.Bed }}</router-link>
  </a>
</template>
        </el-table-column>    
     <el-table-column prop="Time"  align="center" label="创建时间" :formatter="ChangeDateFormat"> </el-table-column>  
    <el-table-column  align="center" label="状态"> 
<template scope="scope">
   {{scope.row.State | StyleIquiryStatus}}
</template>
    </el-table-column>
    <el-table-column  align="center" label="编辑"> 
<template scope="scope">
  <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">
    删除
  </el-button>
  <el-button size="small" type="success" @click="handleDown(scope.$index, scope.row)">
    下载
  </el-button>
</template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="form.UserName" auto-complete="off"></el-input>
        </el-form-item>

           <el-form-item  v-if="dialogStatus=='create'" label="手机：" :label-width="formLabelWidth">
          <el-input v-model="form.Phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="form.Remark" auto-complete="off"></el-input>
        </el-form-item> -->





        <!-- <el-form-item  v-if="dialogStatus=='update'" label="MAC：" :label-width="formLabelWidth">
          <el-input v-model="form.MAC" auto-complete="off"></el-input>
        </el-form-item> -->

            <!-- <el-form-item v-if="dialogStatus=='update'" label="状态：">
           <el-switch
              v-model="form.State"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="启用"
              off-text="禁用"
              :on-value="1"
              :off-value="0">
            </el-switch>
        </el-form-item> -->

         <!-- <el-form-item v-if="dialogStatus=='update'" label="上传权限：">
           <el-switch
              v-model="form.Up"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有"
              off-text="无"
              :on-value="1"
              :off-value="0">
            </el-switch>
        </el-form-item>       -->

        <!-- <el-form-item v-if="dialogStatus=='update'" label="下载权限：">
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
        </el-form-item> -->
       


      <!-- </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog> -->
</div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    bindObj,
    unBindObj,
    downObj
  } from "api/admin/orderSearch";
  import {
    getToken
  } from 'utils/auth';
  import {
    mapGetters
  } from "vuex";
  export default {
    name: "user",
    data() {
      return {
        options: [{
            value: 0,
            label: "废弃"
          },
          {
            value: 1,
            label: "进行中"
          },
          {
            value: 2,
            label: "已完成"
          },
          {
            value: 3,
            label: "延期"
          }
        ],
        optiontimes: [{
            value: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).toLocaleDateString().replace(/\//g, "-") + "-00:00",
            label: "1周内"
          },
          {
            value: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7 * 2).toLocaleDateString().replace(/\//g, "-") + "-00:00",
            label: "2周内"
          },
          {
            value: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7 * 3).toLocaleDateString().replace(/\//g, "-") + "-00:00",
            label: "3周内"
          },
          {
            value: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7 * 4).toLocaleDateString().replace(/\//g, "-") + "-00:00",
            label: "4周内"
          }
        ],
        isBinding: [{
            value: 1,
            label: "绑定"
          },
          {
            value: 0,
            label: "未绑定"
          }
        ],
        form: {
          Bed: undefined,
          ErpName: undefined,
          Id: null,
          ModelName: undefined,
          OrderId: null,
          State: "",
          sTime: undefined,
          eTime:undefined,
          IsBind: 0,
          page: 1,
          limit: 10,
          Yield: undefined
        },
        selectState: "",
        arr: [],
        value8: "",
        value7: "",
        indexColor: 1,
        value9: "",
        colorIndex: 0,
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
        // rules: {
        //   name: [
        //     {
        //       required: true,
        //       message: "请输入用户",
        //       trigger: "blur"
        //     },
        //     {
        //       min: 3,
        //       max: 20,
        //       message: "长度在 3 到 20 个字符",
        //       trigger: "blur"
        //     }
        //   ],
        //   UserName: [
        //     {
        //       required: true,
        //       message: "请输入账户",
        //       trigger: "blur"
        //     },
        //     {
        //       min: 3,
        //       max: 20,
        //       message: "长度在 3 到 20 个字符",
        //       trigger: "blur"
        //     }
        //   ],
        //   password: [
        //     {
        //       required: true,
        //       message: "请输入密码",
        //       trigger: "blur"
        //     },
        //     {
        //       min: 5,
        //       max: 20,
        //       message: "长度在 5 到 20 个字符",
        //       trigger: "blur"
        //     }
        //   ]
        // },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
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
        createdForm: {}
      };
    },
    created() {
      if (this.$route.params.stateCode == 1) {
        this.createdForm.State = 3;
        this.form.State = 3;
        this.getList(this.createdForm);
      } else {
        this.form.State = 1;
        this.getList(this.form);
      }
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      selectColor(row, index) {
        // console.log(this.form.IsBind);
        if (this.form.IsBind == 1) {
          if (row.colorIndex % 2 == 0) {
            return "success-row";
          } else {
            return "warning-row";
          }
        } else {
          return "";
        }
      },
      // 数据格式转化
      isBind(list) {
        if (list.BindId == 0) {
          return "未绑定";
        } else {
          return list.BindId;
        }
      },
      handleSelectionChange(row) {
        this.arr = [];
        let bindName = [];
        let errSelect = false;
        let localSelect = [];
        row.forEach(element => {
          bindName.push(element.BindId);
          //判断如果选择的既有绑定又有未绑定的则进行全部取消
          if (bindName.indexOf(1) != -1 && bindName.indexOf(0) != -1) {
            errSelect = true;
          }
        });
        // 判断禁止的是绑定的还是未绑定的
        if (bindName.length != 0) {
          if (bindName[0] == 0) {
            this.selectState = "unSelect";
            row.forEach(element => {
              this.arr.push(element.Id);
            });
          } else {
            this.selectState = "selected";
            row.forEach(element => {
              if (this.arr.indexOf(element.BindId) == -1) {
                this.arr.push(element.BindId);
              }
            });
          }
        } else {
          this.selectState = "";
        }
        //判断如果选择的既有绑定又有未绑定的则进行全部取消
        if (errSelect) {
          this.$message({
            message: "全选不可包含绑定和未绑定",
            type: "error"
          });
          this.$refs.multipleTable.clearSelection();
        }
      },
      isSelect(row) {
        // console.log(row);
        if (this.selectState == "unSelect" && row.BindId != 0) {
          return 0;
        } else if (this.selectState == "selected" && row.BindId == 0) {
          return 0;
        } else {
          return 1;
        }
      },
      //为相同的绑定号进行局部全选
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      getList(form) {
        this.listLoading = true;
        console.log(this.form)
        page(form).then(response => {
          console.log(response)
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
            //在每个list中加判断
            this.list.forEach((element, index) => {
              if (index == 0) {
                element.colorIndex = this.colorIndex;
              } else {
                if (this.list[index].BindId == this.list[index - 1].BindId) {
                  element.colorIndex = this.colorIndex;
                } else {
                  this.colorIndex++;
                  element.colorIndex = this.colorIndex;
                }
              }
            });
          } else {
            //失败提示
            this.$notify({
              message: response.tip,
              type: "warning",
              duration: 2000
            });
            this.listLoading = false;
          }
        });
      },
      //绑定
      handleBind() {
        // var isAllow = false;
        // this.arr.forEach(element => {
        //   if(element.indexOf(this.arr)==-1){
        //     this.$notify({
        //       message:"样板名不能一致",
        //       type:"error",
        //       durantion:2000
        //     })
        //   }
        // });
        bindObj(this.arr).then(res => {
          if (res.status == 200) {
            this.$notify({
              message: "修改成功",
              type: "success",
              duration: 2000
            });
            this.getList(this.form);
          } else if (res.status == 201) {
            this.$notify({
              message: res.tip,
              type: "error",
              durantion: 2000
            });
            this.getList(this.form);
          }
        });
      },
      // 解绑
      handleUnBind() {
        unBindObj(this.arr).then(res => {
          if (res.status == 200) {
            this.$notify({
              message: "修改成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          } else if (res.status == 201) {
            this.$notify({
              message: res.tip,
              type: "error",
              durantion: 2000
            });
            this.getList(this.form);
          }
        });
      },
      handleFilter() {
        // console.log(this.value7);
        // this.form.sTime =new Date().toLocaleDateString().replace(/\//g, "-") +"-00:00";
        // console.log(this.form)
        if (this.form.sTime != undefined && this.form.sTime != "" && this.form.sTime != null) {
          this.form.eTime =
            new Date().toLocaleDateString().replace(/\//g, "-") +
            "-00:00";
          // this.form.eTime =
          //   new Date(this.form.eTime).toLocaleDateString().replace(/\//g, "-") +
          //   "-23:59";
          //  this.form.sTime = undefined;
          // console.log(this.form);
        } else {
          this.form.sTime = undefined;
          this.form.eTime = undefined;
        }
        this.getList(this.form)
        // 重置表单
        // this.getList(this.listQuery);
      },
      handleSizeChange(val) {
        this.form.limit = val;
        this.getList(this.form);
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.getList(this.form);
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      handleEdit(index, row) {
        var form = {};
        form.Id = row.Id;
        form.OrderId = row.OrderId;
        // console.log(form);
        delObj(form).then(res => {
          // console.log(res);
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              offset: 700,
              message: "废弃成功",
              type: "success",
              durantion: 2000
            });
          } else if (res.status == 201) {
            this.$notify({
              title: "失败",
              offset: 700,
              message: res.tip,
              type: "error",
              durantion: 2000
            });
          } else {
            this.$notify({
              offset: 700,
              message: res.tip,
              type: "warning",
              durantion: 2000
            });
          }
          this.getList(this.form);
        });
      },
      handleDown(index,row){
        // // console.log(row);
        // // console.log(this.$store.getters.token);
        let form = {};
        form.Id = row.Id;
        form.token = this.$store.getters.token;
        // console.log(form)
        downObj(form).then(res=>{
          if(res.status==201){
            this.$notify({
              message:res.tip,
              type:"error",
              durantion:2000,
              offset:700
            })
          }else{
              window.location.href = "/bmapi/downOrder?Id="+form.Id+"&token="+form.token;
          }
        })
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
              this.getList(this.form);
              this.$notify({
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
              this.getList(this.form);
              this.$notify({
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
          State: "",
          Up: undefined,
          Down: undefined,
          MAC: undefined,
          Remark: undefined,
          Yield: undefined
        };
      }
    },
    filters: {
      StyleIquiryStatus: function(val) {
        return val == 0 ?
          "废弃" :
          val == 1 ? "进行中" : val == 2 ? "已完成" : "未知";
      }
    }
  };
</script>
<style>
  .el-table .success-row {
    background: oldlace;
    /* border-top: 2px solid #aaa; */
  }
  .el-table .warning-row {
    background: #f0f9eb;
    /* border-top: 2px solid #aaa; */
  }
</style>
