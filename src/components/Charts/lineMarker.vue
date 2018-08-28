<template>
  <!-- PieceworkStatistics -->
  <div :style="{height:height,width:width}">
    <!-- 年：
              <el-date-picker v-model="value5" align="right" type="year" placeholder="选择年"  style="width: 100px;">
              </el-date-picker> -->
    时间：
    <!-- <el-date-picker v-model="value7" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions2" @change="textChange">
        </el-date-picker> -->
    <el-date-picker v-model="listQuery['year']" type="month" placeholder="选择月" @change="choiceMonth">
    </el-date-picker>
    查询模式：
    <el-select v-model="listQuery['model']" placeholder="请选择" style="width: 100px;" @change="search">
      <!-- <el-option key="all" label="综合加权" value="all" v-if="power==1&&staffId==''"></el-option> -->
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-input @keyup.enter.native="search" style="width: 300px;" class="filter-item" v-model.number="staffId" :disabled="power==0" placeholder="请输入员工工号">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="search">搜索</el-button>
    <div :class="className" :id="id" :style="{height:height,width:width}">
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
  import echarts from 'echarts'
  import {
    page
  } from "api/admin/chart/piece";
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
  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '800px'
      },
      height: {
        type: String,
        default: '800px'
      }
    },
    data() {
      return {
        chart: null,
        power: '',
        staffId: '',
        legend: [],
        value7: '',
        value9: '',
        value4: '',
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
        value5: "2018",
        listQuery: {
          model: "款",
          year: new Date().toISOString().slice(0,7),
          userId: null,
          PLID:this.$store.state.user.PLID
        },
        series: [],
        X: [],
        Y: [],
        options: [{
          value: '款',
          label: '款'
        }, {
          value: '生产单',
          label: '生产单'
        }, {
          value: 'pod',
          label: 'pod'
        }, {
          value: '件数',
          label: '件数'
        }
        // {
        //   value: '长度',
        //   label: '长度'
        // }
        , {
          value: '床',
          label: '床数'
        }],
        value: 'all'
      }
    },
    mounted() {
      // 加载后台数据
      
      // this.search();
      // this.listQuery.model = 1  //上传  1
      // page(this.listQuery).then(response => {
      //   if (response.status === 200) {
      //     if (response.data.total === 0) {
      //       this.$notify({
      //         message: "无记录",
      //         type: "warning",
      //         duration: 2000
      //       });
      //     } else {
      //       var data = response.data;
      //       console.log(data)
      //       this.X = data.X
      //       this.Y = data.Y
      //       this.initChart()
      //       this.chart = null
      //     }
      //   } else {
      //     this.$notify({
      //       message: response.error,
      //       type: "error",
      //       duration: 2000
      //     });
      //   }
      // });
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    created() {
      this.power = getRole();
      this.search();
      console.log()
    },
    methods: {
      choiceMonth(month) {
        this.listQuery.year = month;
        this.search();
      },
      textChange(type) {
        this.listQuery.model = type;
      },
      search() {
        // console.log(this.listQuery.year);
        // console.log(getUserId());
        if (this.power == 0) {
          this.staffId = getUserId();
          this.listQuery.userId = getUserId();
        } else {
          this.listQuery.userId = this.staffId;
        }
        if(this.listQuery.year!==undefined&&this.listQuery.year!==""&&this.listQuery.year!==null){
          page(this.listQuery).then(response => {
            if (response.status === 200) {
                var data = response.data;
                this.X = data.X
                this.Y = data.Y
                this.initChart()
            }else if(response.status === 201){
              // this.$notify({
              //     message: "无记录",
              //     type: "warning",
              //     duration: 2000,
              //     offset:700
              //   });
                this.chart.dispose()
            }
             else {
              this.$notify({
                offset:700,
                message: response.tip,
                type: "error",
                duration: 2000
              });
            }
          });
        }else{
          this.$notify({
            offset:700,
            message: '请输入时间',
            type: "error",
            duration: 2000
          })
        }
      },
      handleFilter() {
        this.search();
      },
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: this.X,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '统计',
            type: 'bar',
            barWidth: '30%',
            data: this.Y
          }]
        })
      },
    }
  }
</script>
