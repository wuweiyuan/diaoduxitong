
<template>
  <!-- SampleDetails -->
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" border>
      <el-table-column prop="Type" align="center" label="服装分类名"> </el-table-column>
      <el-table-column prop="Brand" align="center" label="客户/品牌"> </el-table-column>
      <el-table-column prop="Time" :formatter="this.ChangeDateFormat" align="center" label="创建时间"> </el-table-column>
      <!-- <el-table-column prop="process_name" width="200px" align="center" label="工序列表">
                      <template scope="scope">
                              <el-button size="small" type="text" @click="handleEdit1(scope.$index, scope.row)">
                                  详情
                              </el-button>
</template>
    </el-table-column>   -->
    <el-table-column  align="center" prop="Image" label="图片" >
<template scope="scope">
  <img style="margin-top:7px" @click="handlImg(scope.row.Image)" :src="defaultImg+scope.row.Image | tempPath" width="100" height="100" />
</template>
    </el-table-column>
  </el-table>


<i class="line" ></i>
<p style=" text-align: center;">工序列表</p> 


<el-dialog :title="dialogImage" :visible.sync="dialogImageVisible"  width="100%"  >
         <img  :src="bigImg" width="100%" height="500px" />
  </el-dialog>



    <el-table :key='tableKey' :data="list1" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
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
    更改状态
  </el-button>
</template>
      </el-table-column>
  </el-table>


    <el-dialog :title="dialogtitleProcess" :visible.sync="dialogFormVisible"  width="100%"  >
    <el-table :key='tableKey' :data="list1" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="ProcessName"  align="center" label="工序名"> </el-table-column>
      <el-table-column prop="UserName"  align="center" label="执行人"> </el-table-column>
      <el-table-column prop="CreateTime"  align="center" label="时间"> </el-table-column>
  </el-table>
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
    pageStep,
    getStyleDetail
  } from "api/admin/styleDetail";
  import {
    mapGetters
  } from "vuex";
  export default {
    name: "user",
    data() {
      return {
        defaultImg: 'http://fwq2012',
        form: {
          UserName: undefined,
          Phone: undefined,
          State: 1,
          Up: undefined,
          Down: 0,
          MAC: undefined,
          Remark: undefined
        },
        value8: '',
        value7: '',
        value9: '',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
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
        list1: null,
        total: null,
        listLoading: true,
        listQuery: {
          ModelName: 1
        },
        dialogtitleProcess: '',
        dialogImage: '',
        addPartner: {},
        sexOptions: ["男", "女"],
        dialogFormVisible: false,
        dialogImageVisible: false,
        bigImg: '',
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
      // this.getList();
      console.log(this.defaultImg)
      // console.log(this.$route.query.id)
      this.listQuery.ModelName = this.$route.query.id;
      this.userManager_btn_edit = this.elements["userManager:btn_edit"];
      this.userManager_btn_del = this.elements["userManager:btn_del"];
      this.userManager_btn_add = this.elements["userManager:btn_add"];
      if (this.$route.query.id == null || this.$route.query.id == '') {
        this.$route.query.id = '';
        this.listLoading = false;
      } else {
        this.getList();
      }
    },
    computed: {
      ...mapGetters(["elements"])
    },
    filters: {
      tempPath(imgurl) {
        // console.log(imgurl)
        return (imgurl.replace(/\\/g, "/")).replace(/\s+/g, "");
      },
      changeStatus: function(val) {
        return val == "0" ? '完成' : '未完成'
      },
    },
    methods: {
      getList() {
        console.log(this.listQuery)
        page(this.listQuery).then(response => {
          if (response.status === 200) {
            //成功加载
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
            console.log(this.list)
            this.handleEdit1(1, this.list[0].ModelId);
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
            this.listLoading = false;
          } else {
            //失败提示
            // this.$notify({
            //   message: response.error,
            //   type: "warning",
            //   duration: 2000
            // });
          }
        });
      },
      getstyleDetail() {
        getStyleDetail(this.listQuery.modelname).then(response => {
          console.log(this.listQuery)
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
            this.listLoading = false;
          } else {
            //失败提示
            // this.$notify({
            //   message: response.error,
            //   type: "warning",
            //   duration: 2000
            // });
          }
        });
      },
      handlImg(imgUrl) {
        this.dialogImageVisible = true;
        // console.log(imgUrl)
        this.bigImg = this.defaultImg + imgUrl;
      },
      handleFilter() {
        //this.getList();
        console.log('tag', this.value7)
        console.log('tag', this.value7[0].toISOString().slice(0, 10))
        console.log('tag', this.value7[1].toISOString().slice(0, 10))
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
      handleEdit1(index, row) {
        getObj(row).then(response => {
          if (response.status === 200) {
            //成功加载
            this.list1 = response.data.rows;
            this.total = response.data.total;
            this.dialogtitleProcess = " 此款式的工序列表"
            console.log(this.list1)
            // this.form = this.list[index];
            // this.currentIndex = index;
            // this.dialogFormVisible = true;
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
      handleEdit(index, row) {
        console.log(row);
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
        console.log(obj);
        if (obj === 10) {
          return true;
        } else
          return false;
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
<style lang="scss" scoped>
  .line {
    border-top: 1px solid #ccc;
    width: 100%;
    height: 15px;
    background-color: #eee;
    display: block;
    margin: 10px 0;
  }
</style>
