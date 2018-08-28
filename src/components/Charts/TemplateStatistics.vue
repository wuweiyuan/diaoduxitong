<template>
  <!-- TemplateStatistics -->
  <div :style="{height:height,width:width}">
    <!-- 年：
          <el-date-picker v-model="value5" align="right" type="year" placeholder="选择年"  style="width: 100px;">
          </el-date-picker> -->
    <!-- 时间： -->
    <!-- <el-date-picker v-model="value7" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions2" @change="textChange">
    </el-date-picker> -->
  <!-- <el-date-picker
    v-model="value4"
    type="month"
    placeholder="选择月"
    @change="choiceMonth"
    >
  </el-date-picker> -->
    <!-- 显示模式：
    <el-select v-model="value" placeholder="请选择" style="width: 100px;" @change="textChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" >
      </el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="search">搜索</el-button> -->
    <div :class="className" :id="id" :style="{height:height,width:width}">
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
  import echarts from 'echarts'
  import {
    page
  } from "api/admin/chart/pie";
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
        legend: [],
        series: [],
        array:[],
        data:null,
        options: [{
          // 款，生产单，pod，床，件数，长度，全部
          value: 'all',
          label: '全部'
        }, {
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
        }, {
          value: '长度',
          label: '长度'
        }, {
          value: '床',
          label: '床'
        }],
        value: 'all'
      }
    },
    
    mounted() {
      
      // this.listQuery.model = 1  //上传  1
      // page(this.listQuery).then(res => {
      //   if (res.status === 200) {
      //     if (res.data.total === 0) {
      //       this.$notify({
      //         message: "无记录",
      //         type: "warning",
      //         duration: 2000
      //       });
      //     } else {
      //       var data = res.data;
      //       console.log(data)
      //       this.X = data.X
      //       this.Y = data.Y
      //       this.initChart()
      //       this.chart = null
      //     }
      //   } else {
      //     this.$notify({
      //       message: res.error,
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
    mounted(){
      //加载饼形图数据
      page().then(res=>{
        if(res.status==200){
          if(res.total==0){
            // this.$notify({
            //   message:"暂无数据",
            //   type:"warning",
            //   duration: 2000
            // })
          }else{
            this.data = res.data.rows;
            for(let i=0;i<this.data.length;i++){
              this.array.push(this.data[i].name);
            }
          }
        }else{
          this.$notify({
            offset:700,
            message: res.tip,
            type: "error",
            duration: 2000
          })
        }
      })
      // 加载后台数据
      this.search();
    },
    methods: {
      choiceMonth(month){
        this.listQuery.year = month;
      },
      textChange(type){
        this.listQuery.model = type;
        console.log(this.listQuery);
      },
      search(){
        page(this.listQuery).then(res => {
        if (res.status === 200) {
          if (res.data.total === 0) {
            // this.$notify({
            //   message: "无记录",
            //   type: "warning",
            //   duration: 2000
            // });
          } else {
            var data = res.data;
            this.initChart()
            this.chart = null
          }
        } else {
          this.$notify({
            offset:700,
            message: res.tip,
            type: "error",
            duration: 2000
          });
        }
      });
      },
      handleFilter() {
        //this.getList();
        console.log('tag', this.value7)
        console.log('tag', this.value7[0].toISOString().slice(0, 10))
        console.log('tag', this.value7[1].toISOString().slice(0, 10))
      },
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: this.array
    },
    series : [
        {
            name: '',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:this.data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
        })
      },
    }
  }
</script>
