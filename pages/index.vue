<template>
  <div class="container">
    <!--      <Button-->
    <!--        type="primary"-->
    <!--        target="_blank"-->
    <!--        to="https://nuxtjs.org/"-->
    <!--      >-->
    <!--        Documentation-->
    <!--      </Button>-->
    <!--      <Button-->
    <!--        target="_blank"-->
    <!--        to="http://v4.iviewui.com/docs/introduce"-->
    <!--      >-->
    <!--        View UI-->
    <!--      </Button>-->
    <!--      <Button-->
    <!--        type="success"-->
    <!--        target="_blank"-->
    <!--        to="https://balkan.app/FamilyTreeJS"-->
    <!--      >-->
    <!--        FamilyTreeJs-->
    <!--      </Button>-->

    <Spin v-if="loading" size="large" fix></Spin>
    <div
      v-else-if="dataTable && dataTable.length > 0"
      :style="{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <div>
        <h2>Thống kê gia tộc</h2>
      </div>
      <div :style="{ flex: '1' }">
        <div :style="{ height: '50%', width: '100%' }">
          <v-chart :option="optionLine" :autoresize="true" />
        </div>
        <div :style="{ height: '50%', width: '100%', display: 'flex' }">
          <div :style="{ height: '100%', width: '100%' }">
            <v-chart :option="chartOptions" :autoresize="true" />
          </div>
          <div :style="{ height: '100%', width: '100%' }">
            <v-chart :option="optionLineFamily" :autoresize="true" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>Không có dữ liệu</div>
  </div>
</template>

<script>
import { graphic } from 'echarts'
import { mappingChartEducations, mappingGender } from '~/constants/mapping'

export default {
  name: 'HomePage',

  middleware: 'auth',

  data() {
    return {
      loading: false,
      dataAll: null,
      dataAllGender: [],
      dataTableEducation: [],
      dataTable: [],
      dataTableGender: [],
    }
  },

  head() {
    return {
      title: 'Home | FamilyTree Manager',
    }
  },

  computed: {
    chartOptions() {
      return {
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontFamily: 'Arial',
          },
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 16,
            fontFamily: 'Arial',
          },
        },
        title: {
          left: 'center',
          text: 'Giới tính',
          textStyle: {
            // fontSize: 26,
            fontFamily: 'Arial',
          },
        },

        grid: {
          containLabel: true,
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: this.dataTableGender,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            color: ['#cb4aaf', '#6bb4df'],
            label: {
              show: true,
              textBorderWidth: 2,
              position: 'outside',
              formatter: '{c} ({d}%)',
            },
          },
        ],
      }
    },

    optionLine() {
      return {
        tooltip: {
          trigger: 'axis',
          position: (pt) => {
            return [pt[0], '10%']
          },
          formatter: (params) => {
            return `<div class="flex-column">
                   <p class="font-origin">
                      Thế hệ: <span class="semi-bold text-black">${params[0].name}</span>
                   </p>
                   <p class="font-origin">
                     Số thành viên: <span class="semi-bold text-black"> ${params[0].value} </span>
                   </p>
              </div>`
          },
        },
        title: {
          left: 'center',
          text: 'Thế hệ',
          textStyle: {
            // fontSize: 26,
            fontFamily: 'Arial',
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          // bottom: '50%',
          // top: '0%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.timelineGeneration,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: '#00cc77',
            },
          },
          // axisLabel: {
          //   show: false
          // }
        },
        yAxis: {
          type: 'value',
          // axisTick: {
          //   show: false
          // },
          // axisLine: {
          //   show: false
          // },
          // splitLine: {
          //   show: false
          // },
          // axisLabel: {
          //   show: false
          // }
        },
        series: [
          {
            name: 'Số thành viên',
            data: this.dataTable,
            type: 'line',
            smooth: true,
            itemStyle: {
              borderRadius: 50,
              color: '#00cc77',
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 0.2, [
                {
                  offset: 0,
                  color: '#ebf6ef',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      }
    },

    optionLineFamily() {
      return {
        tooltip: {
          trigger: 'axis',
          position: (pt) => {
            return [pt[0], '10%']
          },
          formatter: (params) => {
            return `<div class="flex-column">
                   <p class="font-origin">
                      Thế hệ: <span class="semi-bold text-black">${params[0].name}</span>
                   </p>
                   <p class="font-origin">
                     Số thành viên: <span class="semi-bold text-black"> ${params[0].value} </span>
                   </p>
              </div>`
          },
        },
        title: {
          left: 'center',
          text: 'Học vấn',
          textStyle: {
            // fontSize: 26,
            fontFamily: 'Arial',
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.timelineEducation,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: '#00cc77',
            },
          },
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Số thành viên',
            data: this.dataTableEducation,
            type: 'bar',
            barWidth: '40%',
            smooth: true,
            itemStyle: {
              color: '#00cc77',
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 0.2, [
                {
                  offset: 0,
                  color: '#ebf6ef',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      }
    },

    timelineGeneration() {
      return this.dataAll && this.dataAll.generations
        ? this.dataAll.generations.map((item) => item.generation)
        : []
    },

    timelineEducation() {
      return this.dataAll && this.dataAll.educations
        ? this.dataAll.educations.map((item) => {
            return mappingChartEducations[item.education]
          })
        : []
    },
  },

  created() {
    this.getAllData()
  },

  methods: {
    async getAllData() {
      try {
        this.loading = true
        const res = await this.$axios.$get(this.$api.FAMILY_TREE_STATISTICS)
        this.dataAll = res
        this.dataTable = res.generations.map((item) => item.member_count)
        this.dataTableEducation = res.educations.map(
          (item) => item.member_count
        )
        this.dataTableGender = res.genders.map((item) => {
          return {
            value: item.member_count,
            name: mappingGender[item.gender],
          }
        })
        this.loading = false
      } catch (e) {
        console.log('error: ', e)
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.font-origin {
  font-family: 'Inter', sans-Arial, serif !important;
}

.semi-bold {
  font-weight: 600;
}

.text-black {
  color: black;
}
</style>
