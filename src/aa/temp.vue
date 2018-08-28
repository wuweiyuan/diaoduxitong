<template>
  <div :class="className" :id="id" :style="{height:height,width:width}">
  </div>
</template>

<script>
  import echarts from 'echarts'

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
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        chart: null,
        legend: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周日'],
        yAxis: [],
        listQuery: {
          QueryType: null
        },
        series: [{
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ],
        option: {
        }
      }
    },
    mounted() {
      // 加载后台数据
      this.listQuery.QueryType = 1
      page(this.listQuery).then(response => {
        if (response.status === 200) {
            //成功加载
          var data = response.data;
          console.log(data)
          this.legend = response.legent;
          var array = response.data.series;
          for (let index = 0; index < array.length; index++) {
            const CompanyName = array[index].CompanyName;
            const Data = array[index].Data;
            var obj = {};
            obj.type = "line";
            obj.stack = "总量";
            // this.series[index].type.push('line')
            // this.series[index].stack.push('总量')
            // this.series[index].name.push(CompanyName)
            // this.series[index].data.push(Data)
            console.log(this.series)
          }
          this.initChart()
          this.chart = null
        } else {
            //失败提示
          this.$notify({
            offset:700,
            message: response.error,
            type: "warning",
            duration: 2000
          });
        }
      });


       page(this.listQuery).then(response => {
        if (response.status === 200) {
            //成功加载
          var data = response.data;
          console.log(data)

           //成功提示
           this.$notify({
             offset:700,
            message: response.error,
            type: "warning",
            duration: 2000
          });
        
        } else {
            //失败提示
          this.$notify({
            offset:700,
            message: response.error,
            type: "warning",
            duration: 2000
          });
        }
      });





    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          tooltip: {
            trigger: 'axis'
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
                type: ['line', 'bar', 'stack', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.xAxis
          }],
          yAxis: [{
            type: 'value'
          }],
          series: this.series
        })
      },
    }
  }
</script>
