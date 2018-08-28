<template>
  <div class="app-container calendar-list-container">
    状态：
    <el-select v-model="listQuery.QueryType" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
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
      <el-table-column prop="Attachment" width="200px" align="center" label="文件名"> </el-table-column>
      <el-table-column prop="UserName" width="400px" align="center" label="上传方"> </el-table-column>
      <el-table-column prop="Name" width="400px" align="center" label="接收方"> </el-table-column>
      <el-table-column prop="FileLength" width="100px" align="center" label="文件大小"> </el-table-column>
      <!-- <el-table-column :formatter="dateChange(this.list.Time)" prop="Time" width="200px" align="center" label="时间"> </el-table-column> -->
      <el-table-column prop="Time" width="100px" align="center" label="时间"> </el-table-column>
      <el-table-column   align="center" label="详细" width="250"><template scope="scope">
    
      <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">  
    
        详情
    
      </el-button>
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
    putObj
  } from "api/admin/FileLog/company";
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
          Remark: undefined
        },
        options: [{
            value: "0",
            label: "未下载"
          },
          {
            value: "1",
            label: "已下载"
          },
          {
            value: "2",
            label: "已上传"
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
          Stime: undefined,
          Etime: undefined,
          QueryType: "0",
          query: ""
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
        formLabelWidth: "80px",
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
        this.form = this.list[index];
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
      dateChange: function(time) {
        console.log(time);
        if (time) {
          var date = new Date(Date.parse(time));
          var newDate = date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
          return newDate;
        }
      },
      getUTCTime: function(row, column) {
        var time = row[column.property];
        var str = new Date(time);
        var utc = str.toUTCString();
        return utc;
      },
      dateFormat: function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
