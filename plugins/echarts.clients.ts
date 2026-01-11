// plugins/echarts.client.ts
import { defineNuxtPlugin } from 'nuxt/app'
import VueECharts from 'vue-echarts'

// Import only what you need (tree-shaking)
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  PieChart, LineChart, BarChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
])

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VChart', VueECharts) // <VChart /> everywhere
})
