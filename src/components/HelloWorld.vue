<template>
  <div class="app-container">
    <div class="select-box">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">{{ selectList[selectedIndex].label }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in selectList" :key="index" :command="index">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="detected-data">
      <div class="detected-data-item" v-for="(item, index) in dataList" :key="index">
        <div class="detected-data-item-top">{{ item.key }}</div>
        <div class="detected-data-item-bottom">{{ item.value }}</div>
      </div>
    </div>
    <div id="echart" class="content-item chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Predict',
  data() {
    return {
      dataList: [
        {
          key: '上次检验时间',
          value: '2023/07/28 00:00:00'
        },
        {
          key: '上次检验含量',
          value: 'xxxx mmol/t'
        },
        {
          key: '智能模型预测结果',
          value: 'xxxx mmol/t'
        },
        {
          key: '智能模型预测准确率',
          value: '99%'
        }
      ],
      series: [
        {
          name: '上次检验含量 mmol/t',
          type: 'line',
          smooth: true, // 曲线平滑
          itemStyle: {
            color: '#006ebc'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              // LinearGradient(x0, y0, x1, y1) 表示渐变点从(0,0)开始(0,1)结束 顶部到底部
              {
                offset: 0,
                color: 'rgba(0, 110, 188, 0.1)'
              },
              {
                offset: 1,
                color: 'rgba(0, 110, 188, 0)'
              }
            ])
          },
          data: [
            ['2023-07-01 00:00:00', 0.03],
            ['2023-07-01 14:30:00', 0.02],
            ['2023-07-02 00:00:00', 0.05],
            ['2023-07-02 14:30:00', 0.03],
          ]
          // markPoint: {
          //   data: [
          //     { type: 'max', name: '最大值' },
          //     { type: 'min', name: '最小值' }
          //   ]
          // }
        },
        {
          name: '模型预测结果 mmol/t',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#009fb8'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0, 159, 184, 0.1)'
              },
              {
                offset: 1,
                color: 'rgba(0, 159, 184, 0)'
              }
            ])
          },
          data: [ 
            ['2023-07-01 00:00:00', 0.13],
            ['2023-07-01 01:00:00', 0.12],
            ['2023-07-01 02:00:00', 0.15],
            ['2023-07-01 02:00:00', 0.13],
            ['2023-07-01 04:00:00', 0.12],
            ['2023-07-01 05:30:00', 0.15],
            ['2023-07-01 06:00:00', 0.13],
            ['2023-07-01 07:30:00', 0.12],
            ['2023-07-01 08:00:00', 0.15],
            ['2023-07-01 09:00:00', 0.13],
            ['2023-07-01 10:30:00', 0.12],
            ['2023-07-01 12:00:00', 0.15],
            ['2023-07-01 14:30:00', 0.13],
            ['2023-07-01 16:00:00', 0.13],
            ['2023-07-01 18:30:00', 0.12],
            ['2023-07-02 08:00:00', 0.13],
            ['2023-07-02 10:30:00', 0.12],
            ['2023-07-02 12:00:00', 0.15],
            ['2023-07-02 14:30:00', 0.13],
            ['2023-07-02 16:00:00', 0.13],
            ['2023-07-02 18:30:00', 0.12]
          ]
        }
      ],
      // xAxisData: ['0727 00:00', '0727 14:30', '0728 00:00', '0728 14:30'],
      selectList: [{ label: '二分厂' }, { label: '三分厂' }],
      selectedIndex: 0
    }
  },
  methods: {
    initChart() {
      const myChart = echarts.init(document.getElementById('echart'))
      const option = {
        title: {
          text: '端羧基含量%',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['上次检验含量 mmol/t', '模型预测结果 mmol/t']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          boundaryGap: false,
          minInterval: 0,
          axisLabel: {
            formatter: function (value) {
              var date = new Date(value)
              console.log(date)
              var year = date.getFullYear()
              var month = (date.getMonth() + 1).toString().padStart(2, '0')
              var day = date.getDate().toString().padStart(2, '0')

              var hour = date.getHours().toString().padStart(2, '0')
              var minute = date.getMinutes().toString().padStart(2, '0')
              const x = `${hour}:${minute}`
              if (x == '14:30') {
                console.log('x:', x)
                return month + day + ' ' + hour + ':' + minute
              }
              return ''
            },
            splitLine: {
              show: false
            }
          },
          axisLine: {
            // 设置数值轴线
            lineStyle: {
              width: 1,
              type: 'dashed'
            }
          },
          splitLine: {
            show: true, // x轴的类目轴默认不展示
            // 设置类目轴线
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            // 设置数值轴线
            lineStyle: {
              width: 1,
              type: 'dashed'
            }
          },
          splitLine: {
            show: true, // y轴的类目轴默认展示
            // 设置类目轴线
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        series: this.series
      }
      myChart.setOption(option)
    },

    handleCommand(command) {
      this.selectedIndex = command
      // todo 切换工厂数据 重新初始化
      this.$message('click on item ' + command)
    },

    createData() {
      // 生成第二条曲线的数据，这里只是一个示例，你需要根据实际情况替换这些数据
      // for (var i = 0; i < 2000; i++) {
      //   // 假设你有100个数据点，每个数据点之间相隔1分钟
      //   var time = new Date('2023-07-01T00:00:00') // 从中午12点开始
      //   time.setMinutes(time.getMinutes() + i) // 增加i分钟
      //   this.series[1].data.push([time, 0.1 + Math.random() * 0.01]) // 这里假设纵坐标是一个随机数，你需要根据实际情况替换这个值
      // }
    }
  },
  mounted() {
    this.createData()
    this.initChart()
  }
}
</script>

<style lang="scss" scoped>
$primary-size: 15px;
.detected-data {
  display: flex;
  justify-content: space-between;
  margin: 30px auto;
  margin-top: 4%;
  margin-bottom: 2%;
  &-item {
    width: 16%;
    border-radius: 12px;
    background: #fff;
    &-top {
      padding-left: $primary-size;
      padding-top: $primary-size;
      padding-bottom: $primary-size;
    }
    &-bottom {
      text-align: center;
      padding-bottom: $primary-size;
    }
  }
}

.chart-container {
  height: 60vh;
}

.select-box {
  position: absolute;
  right: 1.5%;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>