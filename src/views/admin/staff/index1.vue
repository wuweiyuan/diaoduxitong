<template>
  <!-- <div class="basetable" v-loading="loading"
       element-loading-text="拼命加载中"> -->
<div class="basetable">
    <div class="selectMenu">
      <!-- <el-date-picker v-model="value6" type="daterange" placeholder="选择日期范围">
      </el-date-picker> -->
      <el-input style="width:200px;" placeholder="输入姓名或者手机号"></el-input>
      <el-button type="primary"  icon="search" >搜索</el-button>
      <el-button type="primary" @click="add"  icon="plus">新增</el-button>
    </div>
    <div class="tableMain">
      <el-table :data="tableData" style="width: 100%;color:black" >
         <el-table-column prop="UserName" label="用户名" width="180">
        </el-table-column>

       <el-table-column class-name="status-col" label="状态" width="120">
        <template scope="scope">   
            <el-switch
              v-model="scope.row.State"
              :on-value= "1"
              :off-value= "0"
              on-color="#ff4949"
              off-color="#13ce66"
              on-text="禁用"
              off-text="启用"
            
             >
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

 
        <el-table-column class-name="status-col" label="上传权限" width="100">
        <template scope="scope">   
            <el-switch
              v-model="scope.row.Permission"
              disabled
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有"
              off-text="无"
              on-value="11"
              off-value="10">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="下载权限" width="100">
        <template scope="scope">   
            <el-switch
              v-model="scope.row.Permission"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有"
              off-text="无"
              on-value="11"
              off-value="10">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
        
        
        <el-table-column prop="MAC" label="Mac" width="160">
        </el-table-column>
        <el-table-column prop="Phone" label="手机" width="180">
        </el-table-column>
       
        <el-table-column label="操作"  width="100">
          <template scope="scope">
            <el-button
              size="small"
              style="color:black"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>

          </template>
        </el-table-column>

         <el-table-column prop="Remark" label="备注" width="500">
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :page-size="100" layout="prev, pager, next, jumper"
                     :total="1000">
      </el-pagination>
    </div> -->


     <!-- <div v-show="listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->


      <div class="block">
              <!-- <span class="demonstration">完整功能</span> -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5,10, 20, 30, 40]"
                :page-size="pageSize"
                :page-count="pagecount"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>


    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">

      <el-form >
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.UserName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-input v-model="form.State" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="上传权限" :label-width="formLabelWidth">
          <el-select v-model="form.Permission" placeholder="选择">
            <el-option label="有" value="有"></el-option>
            <el-option label="无" value="无"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="下载权限" :label-width="formLabelWidth">
          <el-select v-model="form.Permission" placeholder="选择">
            <el-option label="有" value="有"></el-option>
            <el-option label="无" value="无"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="MAC" :label-width="formLabelWidth">
          <el-input v-model="form.mac" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.Phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.Remark" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    data() {
      return {
        values: 1,
        list: null,
        total: null,
        listLoading: true,
         //搜索条件
        criteria: '',
        //默认每页数据量
        pageSize: 20,
    //默认每页数据量
        pagecount: 100,

        //默认高亮行数据id
        highlightId: -1,

        //当前页码
        currentPage: 1,

        //查询的页码
        start: 1,

        //默认数据总数
        totalCount: 1000,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },

        loading: true,
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: '80px',
          //请求的URL
        // url:'http://www.leftyfog.com:3000/tableData',

        url:'http://192.168.3.19/ETDispatchApi2/api/staffmanager',
        form: {},
        value6: '',
        currentPage3: 1,
        statusOptions: ['published', 'draft', 'deleted'],
        temp: {
        id: undefined,
        importance: 0,
        remark: '',
        timestamp: 0,
        title: '',
        type: '',
        status: 'published'
      },

        currentIndex: '',
      }
    },

    filters: {
        statusFilter(status) {
          const statusMap = {
            1: '禁用',
            0: '可用',
            deleted: 'danger'
          }
          return statusMap[status]
        },
        typeFilter(type) {
          return calendarTypeKeyValue[type]
        }
      },

    created() {


      // this.$http.get(this.url + `?_start=${start}&_end=${endpage}`).then((response) => {
      this.$http.get(this.url + `?Cid=4125&pageIndex=1&pageSize=20`).then((response) => {
        if (response.status === 200) {

          console.log(response);
          var data = response.data.pages ;
          console.log(data);

          this.totalCount = data.totalCount;
          this.tableData = response.data.pages;
          this.tableData.upPermission=this.tableData.Permission ;
          this.tableData.upPermission=this.tableData.Permission ;
          
          this.total = response.data.totalCount ;


        }
      });



      // setTimeout(() => {
      //   this.loading = false
      // }, 1500)
    },
    methods: {

      








    //   //从服务器读取数据
    // loadData (criteria, pageNum, pageSize){
    //                console.log('loadData');
    //                   console.log(criteria);
    //                 console.log(pageNum);
    //                 console.log(pageSize);

    //                 this.$http.get(this.url,{parameter:criteria, pageNum:pageNum, pageSize:pageSize}).then(function(res){
    //                   console.log(res.data.pagestudentdata);
    //                     console.log(res.data.number);
    //                     this.tableData = res.data.pagestudentdata;
    //                     this.totalCount = res.data.number;

    //                 },function(){
    //                     console.log('failed');
    //                 });
    //             },




      showTime() {
        this.$alert(this.value6, '起止时间', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: '已显示'
            })
          }
        })
      },
      add() {
        this.form = {
          UserName: '',
          State: '',
          Permission: '',
          Permission: '',
          mac: '',
          Phone: '',
          Remark: ''
        }
        this.dialogFormVisible = true
      },
      update() {
        this.tableData.push(this.form)
        this.dialogFormVisible = false
      },
      handleEdit(index, row) {
        this.form = this.tableData[index]
        this.currentIndex = index
        this.dialogFormVisible = true
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      cancel() {
        this.dialogFormVisible = false
      },
     
       handleSizeChange(val) {
        //this.pageSize = val ;
        this.pageSize = val;

         val = this.currentPage ;     
       

        this.currentPage = val;
        console.log(`当前页: ${val}`);
        var start = (val -1) *  this.pageSize ;
        var endpage = val  * this.pageSize;
        console.log(`start: ${start}`);  
        console.log(`endpage: ${endpage}`); 
        this.$http.get(this.url + `?Cid=4125&pageIndex=${val}&pageSize=${this.pageSize}`).then((response) => {
        if (response.status === 200) {
          console.log(response);
          var data = response.data.pages ;
          console.log(data);
          this.tableData = response.data.pages;
          this.tableData.upPermission=this.tableData.Permission ;

        }
      });


      },
      handleCurrentChange(val) {
        this.currentPage = val;
        console.log(`当前页: ${val}`);
        var start = (val -1) *  this.pageSize ;
        var endpage = val  * this.pageSize;
        console.log(`start: ${start}`);  
        console.log(`endpage: ${endpage}`); 
        this.$http.get(this.url + `?Cid=4125&pageIndex=${val}&pageSize=${this.pageSize}`).then((response) => {
        if (response.status === 200) {
          console.log(response);
          var data = response.data.pages ;
          console.log(data);
          this.tableData = response.data.pages;
          this.tableData.upPermission=this.tableData.Permission ;

        }
      });

      }
    },
  }
</script>
<style lang="scss">
    .basetable {
       margin-left: 3%;
       margin-top:5px;
        margin-right:3%;
      }
    .tableMain {
      margin: {
        top: 10px;
      }
    }
    .page {
      float: right;
      margin: {
        top: 10px;
      }
    }
    .el-pagination {
    text-align: center;
    margin-top: 30px;
  }

</style>
