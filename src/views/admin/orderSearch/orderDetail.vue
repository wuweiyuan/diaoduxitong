<template>
  <div class="app-container calendar-list-container">
    <!-- orderDetail -->
    <p v-if="mode=='process'"></p>
    <el-table v-if="mode=='process'" :key='tableKey' :data="orderList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="OrderId" align="center" label="生产单号"> </el-table-column>
      <el-table-column prop="ModelName" align="center" label="样板名"> </el-table-column>
      <el-table-column prop="ErpName" align="center" label="客户/品牌"> </el-table-column>
      <el-table-column prop="Time" align="center" label="创建时间" :formatter="this.ChangeDateFormat"> </el-table-column>
      <el-table-column prop="Yield" align="center" label="产量"> </el-table-column>
    </el-table>
    <i class="line" v-if="mode=='process'"></i>
    <p v-if="mode=='bed'">床列表</p>
    <el-table v-if="mode=='bed'" :key='tableKey' :data="bedList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="BedName" align="center" label="床名"> </el-table-column>
      <el-table-column prop="MaterialCode" align="center" label="物料编码"> </el-table-column>
      <el-table-column prop="BedLen" align="center" label="长度"> </el-table-column>
      <el-table-column prop="LayCount" align="center" label="层数"> </el-table-column>
      <el-table-column prop="UC" align="center" label="料率"> </el-table-column>
    </el-table>
    <p v-if="mode=='process'">工序列表</p>
    <el-table v-if="mode=='process'" :key='tableKey' :data="processList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="Code" align="center" label="工序名" :formatter="changeProcessName"> </el-table-column>
      <el-table-column prop="loginid" align="center" label="工号"> </el-table-column>
      <el-table-column prop="UserName" align="center" label="执行人"> </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="时间" :formatter="ChangeDateFormat"> </el-table-column>
      <el-table-column prop="State" align="center" label="状态">
        <template scope="scope">
          {{scope.row.State|changeStatus}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编辑">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">
            重置状态
          </el-button>
        </template>
      </el-table-column>
  </el-table>
  <p v-if="mode=='pod'">Pod列表</p>
    <el-table v-if="mode=='pod'" :key='tableKey' :data="PodList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="Pod"  align="center" label="特体"> </el-table-column>  
      <el-table-column prop="UserName"  align="center" label="检查人"> </el-table-column>    
      <el-table-column prop="State"  align="center" label="状态"> 
        <template scope="scope">
          {{scope.row.State|PodStatus}}
        </template>
      </el-table-column>    
      <el-table-column prop="Time"  align="center" label="时间" :formatter="this.ChangeDateFormat"> </el-table-column>                 
  </el-table>
  <p v-if="mode=='Yield'&&type=='0'">产量列表</p>
    <el-table v-if="mode=='Yield'&&type=='0'" :key='tableKey' :data="YieldList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name"  align="center" label="姓名"> </el-table-column>  
      <el-table-column prop="lsh"  align="center" label="流水号"> </el-table-column>    
      <el-table-column prop="pod"  align="center" label="pod值"> </el-table-column>    
  </el-table>
</div>
</template>

<script>
  import {
    // page,
    // addObj,
    // getObj,
    // delObj,
    // getbedlist,
    // putObj,
    pageBed,
    pageStep,
    pageProduct,
    podObj,
    resetProcess,
    GetProInfo
  } from "api/admin/orderDetail";
  import {
    mapGetters
  } from "vuex";
  export default {
    name: "user",
    porps: ["OrderId", "mode"],
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
        mode: "",
        type:"",
        value8: "",
        value7: "",
        value9: "",
        bedList: null,
        processList: null,
        PodList: null,
        orderList: [],
        YieldList:null,
        total: null,
        listLoading: true,
        listQuery: null,
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
        tableKey: 0
      };
    },
    created() {
      this.listLoading = true;
      this.listQuery = this.$route.query.id;
      this.mode = this.$route.query.mode;
      this.type = this.$route.query.type;
      // console.log(this.listQuery);
      if (this.listQuery != null) {
        this.getList();
        this.getProcess();
      } else {
        this.listLoading = false;
      }
      // this.handleEdit1(1, 1);
      // this.userManager_btn_edit = this.elements["userManager:btn_edit"];
      // this.userManager_btn_del = this.elements["userManager:btn_del"];
      // this.userManager_btn_add = this.elements["userManager:btn_add"];
    },
    computed: {
      ...mapGetters(["elements"])
    },
    filters: {
      changeStatus: function(val) {
        return val == "0" ? '完成' : '未完成'
      },
      PodStatus: function(val) {
        return val == "0" ? "未检查" : val == "1" ? "检查完成" : "已修改"
      }
    },
    methods: {
      getProcess() {
        //工序列表
        if (this.mode == 'process') {
          pageStep(this.listQuery).then(response => {
            if (response.status === 200) {
              //成功加载
              this.processList = response.data.rows;
              this.listLoading = false;
              // console.log(this.list)
              //成功提示
              //  this.$notify({
              //   message: response.error,
              //   type: "warning",
              //   duration: 2000
              // });
            } else if (response.status === 201) {
              //成功加载
              // this.$notify({
              //   offset:700,
              //   message: "暂无数据",
              //   type: "warning",
              //   duration: 2000
              // });
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
          })
        }
      },
      getList() {
        // 加载生产单信息
        if (this.mode == 'process') {
          pageProduct(this.listQuery).then(res => {
            if (res.status == 200) {
              console.log(res.data);
              this.orderList.push(res.data);
              console.log(this.orderList);
            }
          })
        }
        // 床信息
        if (this.mode == "bed") {
          pageBed(this.listQuery).then(response => {
            if (response.status === 200) {
              //成功加载
              this.bedList = response.data.rows;
              this.total = response.data.total;
              this.listLoading = false;
            } else if (response.status === 201) {
              //成功加载
              // this.$notify({
              //   message: "暂无数据",
              //   type: "warning",
              //   duration: 2000
              // });
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
        }
        //加载Pod列表
        if (this.mode == "pod") {
          podObj(this.listQuery).then(res => {
            if (res.status == 200) {
              //成功加载
              this.PodList = res.data.rows;
              this.total = res.data.total;
              this.listLoading = false;
            } else if (res.status == 201) {
              // this.$notify({
              //   message: "暂无数据",
              //   type: "warning",
              //   duration: 2000
              // });
              this.listLoading = false;
            } else {
              this.$notify({
                offset: 700,
                message: res.error,
                type: "warning",
                duration: 2000
              });
            }
          })
        }
        //加载产量信息
        if(this.mode=="Yield"&&this.type=="0"){
          GetProInfo(this.listQuery).then(res=>{
            console.log(res);
            if(res.status==200){
              this.YieldList = res.data.rows;
            }
              this.listLoading = false;
          })
        }
      },
      handleFilter() {
        //this.getList();
        console.log("tag", this.value7);
        console.log("tag", this.value7[0].toISOString().slice(0, 10));
        console.log("tag", this.value7[1].toISOString().slice(0, 10));
      },
      handleSizeChange(val) {
        // this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        // this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      handleEdit(index,row){
        var form = {};
        form.code = row.Code;
        form.pcid = this.listQuery
        resetProcess(form).then(res=>{
          if(res.status==200){
            this.$notify({
              offset:700,
              type:"success",
              message:res.tip,
              duration:2000
            })
          }else{
            this.$notify({
              offset:700,
              type:"error",
              message:res.tip,
              duration:2000
            })
          }
        })
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
        // console.log(obj);
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
<style>
  .line {
    width: 100%;
    height: 30px;
    display: block;
  }
  p {
    text-align: center;
  }
</style>

