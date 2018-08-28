<template>
  <!-- CurrentYearStatistics -->
  <!-- <div >
            状态：
            <el-select v-model="listQuery.QueryType" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
  <div :style="{height:'100%'}">
    <el-table :data="tableData" border="">
      <el-table-column prop="Msg1" align="center">
      </el-table-column>
      <el-table-column prop="SumModel" label="样板数" align="center">
      </el-table-column>
      <el-table-column prop="SumOrder" label="生产单数" align="center">
      </el-table-column>
      <el-table-column prop="SumNumber" label="件数" align="center">
      </el-table-column>
      <el-table-column prop="SumBed" label="床数" align="center">
      </el-table-column>
      <el-table-column prop="SumLen" label="铺布总长度" align="center">
      </el-table-column>
      <el-table-column prop="SumPod" label="特体Pod数" align="center">
      </el-table-column>
    </el-table>
    <!-- 列表总数 -->
    <el-table :data="tableData" :show-header="false" border="">
      <el-table-column prop="Msg2" align="center">
      </el-table-column>
      <el-table-column prop="AvgModel" label="AvgModel" align="center">
      </el-table-column>
      <el-table-column prop="AvgOrder" label="AvgOrder" align="center">
      </el-table-column>
      <el-table-column prop="AvgNumber" label="AvgNumber" align="center">
      </el-table-column>
      <el-table-column prop="AvgBed" label="AvgBed" align="center">
      </el-table-column>
      <el-table-column prop="AvgLen" label="AvgLen" align="center">
      </el-table-column>
      <el-table-column prop="AvgPod" label="AvgPod" align="center">
      </el-table-column>
    </el-table>
    <div :class="className" :id="id" :style="{height:'80%',width:'80%'}">
    </div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import {
    page,
    pageTable
  } from "api/admin/chart/CurrentYearStatistics";
  export default {
    props: {
      className: {
        type: String,
        default: "chart"
      },
      id: {
        type: String,
        default: "chart"
      }
    },
    data() {
      return {
        tableData: null,
        chart: null,
        currenWeek: null,
        legend: [
          "样板数",
          "生产单数",
          "件数",
          "床数",
          "铺布总长度",
          "特体Pod数"
        ],
        year1: "2018",
        xAxis: [
          "第2周",
          "第4周",
          "第6周",
          "第8周",
          "第10周",
          "第12周",
          "第14周",
          "第16周",
          "第18周",
          "第20周",
          "第22周",
          "第24周",
          "第26周",
          "第28周",
          "第30周",
          "第32周",
          "第34周",
          "第36周",
          "第38周",
          "第40周",
          "第42周",
          "第44周",
          "第46周",
          "第48周",
          "第50周",
          "第52周"
        ],
        yAxis: [],
        listQuery: {
          year: "2018",
          PLID: this.$store.state.user.PLID
        },
        series: [],
        option: {}
      };
    },
    created() {
      //切割时间xAxis轴。精确到当年的月份
      // var month = new Date().getMonth()+1;
      // console.log(this.xAxis);
      this.currenWeek = Math.ceil(this.getWeekOfYear() / 2);
      this.xAxis.splice(this.currenWeek);
    },
    mounted() {
      // 加载后台数据
      // this.listQuery.QueryType = 1  //上传  1
      page(this.listQuery).then(response => {
        if (response.status === 200) {
          if (response.data.type == 'sql server') {
            this.legend = response.data.legend;
            // console.log(this.legend);
            var array = response.data.series;
            for (let index = 0; index < array.length; index++) {
              const CompanyName = array[index].CompanyName;
              var arr = [];
              for (let i = array[index].Data.length - this.currenWeek; i < array[index].Data.length; i++) {
                arr.push(array[index].Data[i]);
              }
              const Data = arr;
              var obj = {};
              obj.type = "line";
              // obj.stack = "总量";
              obj.name = CompanyName;
              obj.data = Data;
              this.series.push(obj);
              // this.series[index].stack.push('总量')
              // this.series[index].name.push(CompanyName)
              // this.series[index].data.push(Data)
            }
            // console.log(this.series);
            this.initChart();
            // this.chart = null;
          }else{
            this.legend = response.data.legend;
            var array = response.data.series;
            for (let index = 0; index < array.length; index++) {
              const CompanyName = array[index].CompanyName;
              var arr = [];
              for (let i = array[index].Data.length - this.currenWeek; i < array[index].Data.length; i++) {
                arr.push(array[index].Data[i]);
              }
              const Data = arr;
              var obj = {};
              obj.type = "line";
              // obj.stack = "总量";
              obj.name = CompanyName;
              obj.data = Data;
              this.series.push(obj);
              // this.series[index].stack.push('总量')
              // this.series[index].name.push(CompanyName)
              // this.series[index].data.push(Data)
            }
            // console.log(this.series);
            this.initChart();
          }
        } else {
          this.$notify({
            offset: 700,
            message: response.error,
            type: "warning",
            duration: 2000
          });
        }
      });
      //表格数据渲染
      pageTable(this.listQuery).then(res => {
        this.tableData = res.data.rows;
        this.tableData[0].Msg1 = "总数";
        this.tableData[0].Msg2 = "平均";
        // console.log(this.dataTable[0]);
        // console.log(this.tableData);
        // console.log(res.data);
      });
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      //获取当前时间是本年的第几周
      getWeekOfYear() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1);
        var dayOfWeek = firstDay.getDay();
        var spendDay = 1;
        if (dayOfWeek != 0) {
          spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
        var result = Math.ceil(d / 7);
        return result + 1;
      },
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: this.legend
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ["line", "bar", "stack", "tiled"]
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          optionToContent: function(opt) {
            let axisData = opt.xAxis[0].data; //坐标数据
            let series = opt.series; //折线图数据
            let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
            let tdBodys = ''; //数据
            let count1 = 0;
            series.forEach(function(item) {
              //组装表头
              tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
            });
            let table =
              `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
            for (let i = 0, l = axisData.length; i < l; i++) {
              for (let j = 0; j < series.length; j++) {
                //组装表数据
                tdBodys += `<td>${ series[j].data[i]}</td>`;
                count1 += series[j].data[i];
              }
              table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
              tdBodys = '';
            }
            table += '</tbody></table>';
            return table;
          },
          calculable: true,
          xAxis: [{
            type: "category",
            boundaryGap: false,
            data: this.xAxis
          }],
          yAxis: [{
            type: "value"
          }],
          dataZoom: [{
            // 这个dataZoom组件，默认控制x轴。
            type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0, // 左边在 10% 的位置。
            end: 100 // 右边在 60% 的位置。
          }],
          series: this.series
        });
      }
    }
  };
</script>
<style>

</style>
