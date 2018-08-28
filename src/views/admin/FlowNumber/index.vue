<template>
    <div style="min-width:1300px;" class="app-container calendar-list-container">
        <!-- FlowNumber -->
        <div style="margin-bottom:10px">
            流水号：
            <el-input @keyup.enter.native="handleSearch" style="width: 200px;" class="filter-item" placeholder="输入流水号" v-model.number="listQuery.number"> </el-input>
            <el-button class="filter-item" type="primary" v-waves @click="handleSearch">搜索</el-button>
        </div>
        <el-table :data="tableData" v-loading.body="listLoading">
            <el-table-column prop="UserName" label="人名">
            </el-table-column>
            <el-table-column prop="OrderName" label="订单名">
            </el-table-column>
            <el-table-column prop="Time" label="订单创建时间" :formatter="ChangeDateFormat">
            </el-table-column>
            <el-table-column label="编辑">
                <template scope="scope">
                        <el-button @click="handleDown(scope.row)">下载</el-button>
</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    import {
        search,
        downLoad
    } from 'api/admin/flowNumber/flowNumber'
    export default {
        data() {
            return {
                tableData: [],
                listLoading: false,
                listQuery: {
                    page: 1,
                    limit: 10,
                    number: undefined
                },
                total: null,
            };
        },
        created() {},
        computed: {},
        methods: {
            getList() {},
            handleDown(row) {
                let form = row;
                form.token = this.$store.getters.token;
                console.log(form);
                // console.log(row);
                downLoad(form).then(res => {
                    console.log(res)
                    if (res.status == 201) {
                        this.$notify({
                            message: res.tip,
                            type: "error",
                            offset: 700
                        })
                    } else {
                        window.location.href = "/bmapi/downloadLSH?orderName=" + row.OrderName + "&pod=" + row.Pod + "&state=" + row.State + "&token=" + this.$store.getters.token;
                    }
                })
            },
            handleSearch() {
                // console.log(123);
                var reg = /^[0-9]{0,10}$/
                if (reg.test(this.listQuery.number)) {
                    this.listLoading = true;
                    search(this.listQuery.number).then(res => {
                        console.log(res)
                        if (res.status == 200) {
                            this.tableData = res.data.rows;
                            this.listLoading = false;
                            // console.log(this.tableData);
                        } else {
                            this.listLoading = false;
                             this.$message({
                                type: "error",
                                message: res.tip
                            })
                            this.tableData = [];
                            this.$message({
                                type: "error",
                                message: res.tip
                            })
                           
                        }
                    })
                } else {
                    this.$message({
                        type: "error",
                        message: "请输入正确的流水号"
                    })
                    this.listLoading = false;
                }
            }
        },
        filters: {}
    };
</script>
