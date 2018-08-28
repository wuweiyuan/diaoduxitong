<template>
  <div style="min-width:1300px;" class="app-container calendar-list-container">
    <!-- viewLog -->
    <el-table :data="tableData">
      <el-table-column prop="Pc_Name" label="流程名">
      </el-table-column>
      <el-table-column prop="UserName" label="员工名">
      </el-table-column>
      <el-table-column prop="Code" label="工序名" :formatter="changeProcessName">
      </el-table-column>
      <el-table-column prop="time" label="时间" :formatter="this.ChangeDateFormat">
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  </div>
</template>

<script>
  import {
    page
  } from 'api/admin/viewLog/viewLog'
  export default {
    data() {
      return {
        tableData: [],
        listLoading : false,
        listQuery:{
          page:1,
          limit:10
        },
        total:null
      };
    },
    created() {
      this.getList();
    },
    computed: {},
    methods: {
      getList(){
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
    },
    filters: {}
  };
</script>
